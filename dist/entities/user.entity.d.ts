import { Todo } from './todo.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    fullname: string;
    createdAt: Date;
    todos: Todo[];
}
