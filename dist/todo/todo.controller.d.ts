import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import type { TodoStatus, Todo } from './todo.service';
interface AuthenticatedRequest {
    user: {
        userId: number;
        email: string;
        fullname: string;
    };
}
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto, req: AuthenticatedRequest): Promise<Todo>;
    findAll(status?: TodoStatus, userId?: number, req?: AuthenticatedRequest): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo>;
    updateOrder(id: number, order: number): Promise<Todo>;
    remove(id: number): Promise<void>;
}
export {};
