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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
let SupabaseController = class SupabaseController {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async checkHealth() {
        try {
            const client = this.supabaseService.getClient();
            return {
                status: 'connected',
                message: 'Supabase connection is working',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async testQuery(body) {
        try {
            const client = this.supabaseService.getClient();
            const table = body.table || 'your_table_name';
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Query failed',
            };
        }
    }
};
exports.SupabaseController = SupabaseController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Post)('test-query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "testQuery", null);
exports.SupabaseController = SupabaseController = __decorate([
    (0, common_1.Controller)('supabase'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SupabaseController);
//# sourceMappingURL=supabase.controller.js.map