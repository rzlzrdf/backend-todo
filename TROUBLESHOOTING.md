# 🔧 Troubleshooting Netlify Serverless Deployment

## Runtime.ExitError Issues

If you encounter `Runtime.ExitError - RequestId: xxx Error: Runtime exited with error: exit status 1`, follow these steps:

### 1. Check Environment Variables

First, test if your environment variables are properly set:

```bash
# Deploy and test the environment check function
curl https://your-site.netlify.app/test-env
```

Expected response:
```json
{
  "message": "Environment variables check",
  "environment": {
    "NODE_ENV": "production",
    "SUPABASE_URL": "SET",
    "SUPABASE_ANON_KEY": "SET",
    "SUPABASE_SERVICE_ROLE_KEY": "SET",
    "JWT_SECRET": "SET"
  }
}
```

### 2. Test Basic Function

Test the health check function:

```bash
curl https://your-site.netlify.app/health
```

Expected response:
```json
{
  "message": "Health check successful",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 3. Common Issues and Solutions

#### Issue: Missing Environment Variables
**Symptoms**: Function fails to start, Supabase connection errors
**Solution**: 
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add all required variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

#### Issue: Dependency Problems
**Symptoms**: Module not found errors
**Solution**:
1. Check if all dependencies are in `package.json`
2. Run `npm install` locally
3. Ensure `@vendia/serverless-express` and `aws-lambda` are installed

#### Issue: Build Failures
**Symptoms**: Build process fails
**Solution**:
1. Test build locally: `npm run build:netlify`
2. Check for TypeScript errors
3. Verify webpack configuration

#### Issue: Memory/Timeout Issues
**Symptoms**: Function times out or runs out of memory
**Solution**:
1. Check function logs in Netlify Dashboard
2. Optimize bundle size
3. Consider using background functions for long-running tasks

### 4. Debugging Steps

#### Step 1: Check Function Logs
1. Go to Netlify Dashboard → Functions
2. Click on your function
3. Check the "Logs" tab for error messages

#### Step 2: Test Locally
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test locally
netlify dev

# Test specific function
netlify functions:invoke api
```

#### Step 3: Check Build Output
```bash
# Build and check for errors
npm run build:netlify

# Check the dist folder
ls -la dist/
```

### 5. Alternative Solutions

#### Option 1: Simplify the Function
If the main API function is too complex, try a minimal version:

```typescript
// netlify/functions/api-simple.ts
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'API is working' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};
```

#### Option 2: Use Express Directly
If NestJS is causing issues, try a simple Express setup:

```typescript
// netlify/functions/api-express.ts
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Express API working' });
});

export const handler = serverlessExpress({ app });
```

### 6. Environment-Specific Issues

#### Development vs Production
- **Development**: Use `NODE_ENV=development`
- **Production**: Use `NODE_ENV=production`

#### Supabase Connection
- Ensure Supabase project is active
- Check if RLS policies are configured
- Verify API keys are correct

### 7. Performance Optimization

#### Bundle Size
- Use webpack to minimize bundle size
- Exclude unnecessary modules
- Enable tree-shaking

#### Cold Starts
- Keep dependencies minimal
- Use connection pooling
- Consider warm-up functions

### 8. Getting Help

If issues persist:

1. **Check Netlify Status**: [status.netlify.com](https://status.netlify.com)
2. **Netlify Community**: [community.netlify.com](https://community.netlify.com)
3. **Function Logs**: Check detailed logs in Netlify Dashboard
4. **GitHub Issues**: Check for known issues in NestJS or Netlify repositories

### 9. Quick Fix Checklist

- [ ] Environment variables set in Netlify
- [ ] All dependencies installed
- [ ] Build succeeds locally
- [ ] Function logs checked
- [ ] Health check function works
- [ ] CORS headers configured
- [ ] Error handling implemented
- [ ] Bundle size optimized

### 10. Emergency Fallback

If nothing works, deploy a simple API:

```typescript
// netlify/functions/fallback.ts
export const handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ 
    message: 'Fallback API working',
    timestamp: new Date().toISOString()
  }),
  headers: { 'Content-Type': 'application/json' }
});
```

This will help you verify that Netlify Functions are working correctly.
