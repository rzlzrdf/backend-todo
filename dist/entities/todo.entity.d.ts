import { User } from './user.entity';
export declare enum TodoStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed"
}
export declare class Todo {
    id: number;
    note: string;
    status: TodoStatus;
    order: number;
    userId: number;
    createdAt: Date;
    user: User;
}
