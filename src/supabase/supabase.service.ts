import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️  Supabase credentials not found. Please update your .env file with valid Supabase credentials.');
      console.warn('   The application will start but Supabase features will not work.');
      return;
    }

    if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
      console.warn('⚠️  Please update your .env file with actual Supabase credentials.');
      console.warn('   The application will start but Supabase features will not work.');
      return;
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error.message);
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized. Please check your .env configuration.');
    }
    return this.supabase;
  }

  // Helper method to get service role client for admin operations
  getServiceRoleClient(): SupabaseClient {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase URL and Service Role Key are required for admin operations');
    }

    if (supabaseUrl === 'your_supabase_project_url' || serviceRoleKey === 'your_supabase_service_role_key') {
      throw new Error('Please update your .env file with actual Supabase credentials');
    }

    return createClient(supabaseUrl, serviceRoleKey);
  }
}
