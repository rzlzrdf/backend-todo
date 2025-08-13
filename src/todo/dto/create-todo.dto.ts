import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

enum TodoStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class CreateTodoDto {
  @IsString()
  note: string;

  @IsOptional()
  @IsEnum(TodoStatusEnum)
  status?: string = 'pending';

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}
