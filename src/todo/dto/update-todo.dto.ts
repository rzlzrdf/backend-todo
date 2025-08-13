export class UpdateTodoDto {
  note?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  order?: number;
}
