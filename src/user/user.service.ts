/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: number;
  email: string;
  password: string;
  fullname: string;
  created_at: string;
}

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const client = this.supabaseService.getClient();

    // Check if user with email already exists
    const { data: existingUser } = await client
      .from('user')
      .select('id')
      .eq('email', createUserDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const { data, error } = await client
      .from('user')
      .insert([createUserDto])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as User;
  }

  async findAll(): Promise<User[]> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return (data || []) as User[];
  }

  async findOne(id: number): Promise<User> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return null;
    }

    return data as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const client = this.supabaseService.getClient();

    // If email is being updated, check if it's already taken
    if (updateUserDto.email) {
      const { data: existingUser } = await client
        .from('user')
        .select('id')
        .eq('email', updateUserDto.email)
        .neq('id', id)
        .single();

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const { data, error } = await client
      .from('user')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data as User;
  }

  async remove(id: number): Promise<void> {
    const client = this.supabaseService.getClient();

    const { error } = await client.from('user').delete().eq('id', id);

    if (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
