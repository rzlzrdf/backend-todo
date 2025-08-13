# 🚀 Netlify Serverless Deployment Guide

This guide will help you deploy your NestJS API to Netlify as serverless functions.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Environment Variables**: Set up your environment variables in Netlify

## 🔧 Configuration Files

### 1. `netlify.toml`
- Configures build settings and redirects
- Routes `/api/*` to serverless functions
- Sets Node.js version and bundler

### 2. `netlify/functions/api.ts`
- Main serverless function entry point
- Handles NestJS app initialization
- Manages CORS and validation

### 3. `webpack.config.js`
- Optimizes bundle size for serverless
- Excludes unnecessary modules
- Configures external dependencies

## 🚀 Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build for Production
```bash
npm run build:netlify
```

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Netlify Dashboard
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Set build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### Step 4: Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key

# Database Configuration (if using TypeORM)
SUPABASE_DB_HOST=db.your-project.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_DB_NAME=postgres
```

## 🌐 API Endpoints

After deployment, your API will be available at:
- **Base URL**: `https://your-site.netlify.app/.netlify/functions/api`
- **Auth**: `https://your-site.netlify.app/.netlify/functions/api/auth`
- **Todos**: `https://your-site.netlify.app/.netlify/functions/api/todos`
- **Users**: `https://your-site.netlify.app/.netlify/functions/api/users`

### Example API Calls

```bash
# Register a user
curl -X POST https://your-site.netlify.app/.netlify/functions/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullname": "John Doe"
  }'

# Login
curl -X POST https://your-site.netlify.app/.netlify/functions/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Create todo (with JWT token)
curl -X POST https://your-site.netlify.app/.netlify/functions/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "note": "Buy groceries",
    "status": "pending"
  }'
```

## 🔒 Authentication

All todo endpoints require JWT authentication:
- Include `Authorization: Bearer YOUR_JWT_TOKEN` header
- User ID is automatically set from JWT token
- Todos are filtered by authenticated user

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

2. **Function Timeouts**
   - Cold starts can take 1-3 seconds
   - Consider using Netlify's background functions for long-running tasks

3. **CORS Issues**
   - CORS is enabled for all origins in development
   - Configure specific origins for production

4. **Environment Variables**
   - Ensure all required env vars are set in Netlify
   - Check for typos in variable names

### Debugging

```bash
# Test locally with Netlify CLI
netlify dev

# Check function logs
netlify functions:list
netlify functions:invoke api
```

## 📊 Performance Tips

1. **Bundle Optimization**
   - Webpack excludes unnecessary modules
   - Use tree-shaking for smaller bundles

2. **Cold Start Optimization**
   - Keep dependencies minimal
   - Use connection pooling for database

3. **Caching**
   - Implement Redis for session storage
   - Use CDN for static assets

## 🔄 Continuous Deployment

Set up automatic deployments:
1. Connect your Git repository to Netlify
2. Configure build settings
3. Deploy automatically on push to main branch

## 📝 Notes

- Serverless functions have a 10-second timeout limit
- Maximum payload size is 6MB
- Functions are stateless - don't rely on in-memory storage
- Use Supabase for persistent data storage

## 🆘 Support

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
