import { SupabaseService } from './supabase.service';
export declare class SupabaseController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    checkHealth(): Promise<{
        status: string;
        message: any;
        timestamp: string;
    }>;
    testQuery(body: {
        table?: string;
    }): Promise<{
        success: boolean;
        data: any[];
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
}
