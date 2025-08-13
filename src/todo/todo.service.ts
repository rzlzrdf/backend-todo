/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export interface Todo {
  id: number;
  note: string;
  status: 'pending' | 'in_progress' | 'completed';
  order: number;
  user_id?: number;
  created_at: string;
}

export type TodoStatus = 'pending' | 'in_progress' | 'completed';

@Injectable()
export class TodoService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const client = this.supabaseService.getClient();

    // If no order is provided, get the next order number
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

    return data as Todo;
  }

  async findAll(): Promise<Todo[]> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }

    return (data || []) as Todo[];
  }

  async findOne(id: number): Promise<Todo> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return data as Todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .update(updateTodoDto)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return data as Todo;
  }

  async remove(id: number): Promise<void> {
    const client = this.supabaseService.getClient();

    const { error } = await client.from('todolist').delete().eq('id', id);

    if (error) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  async updateOrder(id: number, newOrder: number): Promise<Todo> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .update({ order: newOrder })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return data as Todo;
  }

  async findByStatus(status: TodoStatus): Promise<Todo[]> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .select('*')
      .eq('status', status)
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch todos by status: ${error.message}`);
    }

    return (data || []) as Todo[];
  }

  async findByUserId(userId: number): Promise<Todo[]> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('todolist')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch todos by user: ${error.message}`);
    }

    return (data || []) as Todo[];
  }
}
