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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let UserService = class UserService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(createUserDto) {
        const client = this.supabaseService.getClient();
        const { data: existingUser } = await client
            .from('user')
            .select('id')
            .eq('email', createUserDto.email)
            .single();
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const { data, error } = await client
            .from('user')
            .insert([createUserDto])
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
        return data;
    }
    async findAll() {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('user')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
        return (data || []);
    }
    async findOne(id) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('user')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return data;
    }
    async findByEmail(email) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('user')
            .select('*')
            .eq('email', email)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    async update(id, updateUserDto) {
        const client = this.supabaseService.getClient();
        if (updateUserDto.email) {
            const { data: existingUser } = await client
                .from('user')
                .select('id')
                .eq('email', updateUserDto.email)
                .neq('id', id)
                .single();
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const { data, error } = await client
            .from('user')
            .update(updateUserDto)
            .eq('id', id)
            .select()
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return data;
    }
    async remove(id) {
        const client = this.supabaseService.getClient();
        const { error } = await client.from('user').delete().eq('id', id);
        if (error) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map