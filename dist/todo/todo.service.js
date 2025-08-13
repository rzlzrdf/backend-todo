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
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let TodoService = class TodoService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(createTodoDto) {
        const client = this.supabaseService.getClient();
        if (!createTodoDto.order) {
            const { data: maxOrderResult } = await client
                .from('todolist')
                .select('order')
                .order('order', { ascending: false })
                .limit(1)
                .single();
            createTodoDto.order = maxOrderResult?.order
                ? maxOrderResult.order + 1
                : 1;
        }
        const { data, error } = await client
            .from('todolist')
            .insert([createTodoDto])
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create todo: ${error.message}`);
        }
        return data;
    }
    async findAll() {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .select('*')
            .order('order', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch todos: ${error.message}`);
        }
        return (data || []);
    }
    async findOne(id) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return data;
    }
    async update(id, updateTodoDto) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .update(updateTodoDto)
            .eq('id', id)
            .select()
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return data;
    }
    async remove(id) {
        const client = this.supabaseService.getClient();
        const { error } = await client.from('todolist').delete().eq('id', id);
        if (error) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
    }
    async updateOrder(id, newOrder) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .update({ order: newOrder })
            .eq('id', id)
            .select()
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return data;
    }
    async findByStatus(status) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .select('*')
            .eq('status', status)
            .order('order', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch todos by status: ${error.message}`);
        }
        return (data || []);
    }
    async findByUserId(userId) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('todolist')
            .select('*')
            .eq('user_id', userId)
            .order('order', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch todos by user: ${error.message}`);
        }
        return (data || []);
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TodoService);
//# sourceMappingURL=todo.service.js.map