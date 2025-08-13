import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('health')
  async checkHealth() {
    try {
      const client = this.supabaseService.getClient();
      // Simple health check - you can replace this with actual table queries
      return {
        status: 'connected',
        message: 'Supabase connection is working',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('test-query')
  async testQuery(@Body() body: { table?: string }) {
    try {
      const client = this.supabaseService.getClient();
      const table = body.table || 'your_table_name';
      
      // Example query - replace with your actual table
      const { data, error } = await client
        .from(table)
        .select('*')
        .limit(5);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data,
        message: `Successfully queried ${table}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Query failed',
      };
    }
  }
}
