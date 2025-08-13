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
export declare class TodoService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo>;
    remove(id: number): Promise<void>;
    updateOrder(id: number, newOrder: number): Promise<Todo>;
    findByStatus(status: TodoStatus): Promise<Todo[]>;
    findByUserId(userId: number): Promise<Todo[]>;
}
