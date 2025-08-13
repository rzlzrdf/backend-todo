import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import type { TodoStatus, Todo } from './todo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    userId: number;
    email: string;
    fullname: string;
  };
}

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Todo> {
    // Automatically set user_id from authenticated user
    createTodoDto.user_id = req.user.userId;
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(
    @Query('status') status?: TodoStatus,
    @Query('user_id') userId?: number,
    @Request() req?: AuthenticatedRequest,
  ): Promise<Todo[]> {
    // If no user_id specified, use authenticated user's ID
    const targetUserId = userId || req?.user?.userId;

    if (targetUserId) {
      if (status) {
        // Filter by both user and status
        return this.todoService
          .findByUserId(targetUserId)
          .then((todos) => todos.filter((todo) => todo.status === status));
      }
      return this.todoService.findByUserId(targetUserId);
    }

    if (status) {
      return this.todoService.findByStatus(status);
    }

    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Patch(':id/order')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body('order') order: number,
  ) {
    return this.todoService.updateOrder(id, order);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
