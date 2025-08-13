"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    configService;
    supabase;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseAnonKey = this.configService.get('SUPABASE_ANON_KEY');
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
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
            console.log('✅ Supabase client initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error.message);
        }
    }
    getClient() {
        if (!this.supabase) {
            throw new Error('Supabase client is not initialized. Please check your .env configuration.');
        }
        return this.supabase;
    }
    getServiceRoleClient() {
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase URL and Service Role Key are required for admin operations');
        }
        if (supabaseUrl === 'your_supabase_project_url' || serviceRoleKey === 'your_supabase_service_role_key') {
            throw new Error('Please update your .env file with actual Supabase credentials');
        }
        return (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey);
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map