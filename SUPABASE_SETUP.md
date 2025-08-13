# Supabase Setup Guide

This NestJS project is configured to work with Supabase. Follow these steps to complete the setup:

## 1. Environment Configuration

Update the `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 2. Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Project Structure

```
src/
├── supabase/
│   ├── supabase.module.ts    # Supabase module configuration
│   ├── supabase.service.ts   # Supabase client service
│   └── supabase.controller.ts # Example API endpoints
└── app.module.ts             # Main app module with Supabase integration
```

## 4. Available Endpoints

Once the application is running, you can test the Supabase connection:

- `GET /supabase/health` - Check Supabase connection status
- `POST /supabase/test-query` - Test database queries (requires table name in body)

## 5. Usage Examples

### In Services
```typescript
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class YourService {
  constructor(private supabaseService: SupabaseService) {}

  async getData() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('your_table')
      .select('*');
    
    return data;
  }
}
```

### Admin Operations
```typescript
// For admin operations (bypasses RLS)
const adminClient = this.supabaseService.getServiceRoleClient();
```

## 6. Running the Application

```bash
# Development
npm run start

# Development with watch mode
npm run start:dev

# Production
npm run start:prod
```

## 7. Security Notes

- Never commit your `.env` file to version control
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS)
- Use the anon key for client-side operations
- Use the service role key only for admin operations

## 8. Next Steps

1. Create your database tables in Supabase
2. Set up Row Level Security (RLS) policies
3. Create additional services for your specific use cases
4. Add authentication if needed
