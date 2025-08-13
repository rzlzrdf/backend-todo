# TypeORM with Supabase Guide

This guide explains how to use TypeORM with your Supabase database for better type safety and query management.

## Overview

TypeORM provides:
- **Type Safety**: Full TypeScript support with entities
- **Query Builder**: Powerful query building capabilities
- **Relations**: Easy relationship management
- **Migrations**: Database schema versioning
- **Repository Pattern**: Clean data access layer

## Project Structure

```
src/
├── entities/                    # TypeORM entities
│   ├── user.entity.ts
│   └── todo.entity.ts
├── config/                      # Configuration files
│   ├── database.config.ts
│   └── typeorm.config.ts
├── database/                    # Database module
│   └── database.module.ts
└── migrations/                  # TypeORM migrations
    └── *.ts
```

## Setup

### 1. Environment Variables

Update your `.env` file with database credentials:

```env
# Database Configuration (for TypeORM)
SUPABASE_DB_HOST=db.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_database_password
SUPABASE_DB_NAME=postgres
```

### 2. Get Database Credentials

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings** → **Database**
3. Copy the connection details:
   - **Host**: `db.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password

## Available Commands

### TypeORM Commands

| Command | Description |
|---------|-------------|
| `npm run typeorm` | Run TypeORM CLI |
| `npm run migration:generate` | Generate migration from entity changes |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run schema:sync` | Sync schema (⚠️ destructive) |
| `npm run schema:drop` | Drop all tables (⚠️ destructive) |

## Creating Migrations

### 1. Generate Migration

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/AddUserProfile
```

### 2. Create Migration Manually

```bash
# Create empty migration
npm run typeorm migration:create src/migrations/AddUserProfile
```

### 3. Example Migration

```typescript
// src/migrations/1234567890123-AddUserProfile.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfile1234567890123 implements MigrationInterface {
    name = 'AddUserProfile1234567890123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_profile" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "bio" character varying,
                "avatar_url" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_profile" PRIMARY KEY ("id")
            )
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user_profile" 
            ADD CONSTRAINT "FK_user_profile_user" 
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_user_profile_user"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
    }
}
```

## Running Migrations

### 1. Run Migrations

```bash
npm run migration:run
```

### 2. Revert Migration

```bash
npm run migration:revert
```

### 3. Check Migration Status

```bash
npm run typeorm migration:show
```

## Entity Examples

### User Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Todo } from './todo.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
```

### Todo Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('todolist')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.PENDING,
  })
  status: TodoStatus;

  @Column({ name: 'order' })
  order: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

## Service Examples

### Using Repository

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['todos'],
    });
  }
}
```

### Using Query Builder

```typescript
async findTodosWithUser(): Promise<Todo[]> {
  return await this.todoRepository
    .createQueryBuilder('todo')
    .leftJoinAndSelect('todo.user', 'user')
    .where('todo.status = :status', { status: TodoStatus.PENDING })
    .orderBy('todo.order', 'ASC')
    .getMany();
}
```

## Best Practices

### 1. Entity Design

- Use descriptive column names
- Define proper relationships
- Add indexes for performance
- Use enums for status fields

### 2. Migration Strategy

- Always generate migrations for schema changes
- Test migrations in development first
- Keep migrations small and focused
- Include both up and down methods

### 3. Query Optimization

- Use relations to avoid N+1 queries
- Add indexes for frequently queried columns
- Use query builder for complex queries
- Limit result sets when possible

### 4. Error Handling

```typescript
try {
  const user = await this.userRepository.findOne({
    where: { id },
  });
  
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  
  return user;
} catch (error) {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException('Database error occurred');
}
```

## Troubleshooting

### Connection Issues

1. **Check credentials** in `.env` file
2. **Verify SSL settings** for Supabase
3. **Test connection** with a simple query
4. **Check firewall** and network settings

### Migration Issues

1. **Check entity definitions** match database schema
2. **Verify migration order** is correct
3. **Test migrations** in development first
4. **Backup database** before running migrations

### Performance Issues

1. **Add indexes** for frequently queried columns
2. **Use relations** to avoid N+1 queries
3. **Limit result sets** with pagination
4. **Monitor query performance** with logging

## Next Steps

1. **Set up your database credentials** in `.env`
2. **Test the connection** with a simple query
3. **Generate initial migration** if needed
4. **Run migrations** to sync schema
5. **Start using TypeORM** in your services

## Migration from Supabase Client

The main benefits of switching to TypeORM:

- **Better Type Safety**: Full TypeScript support
- **Query Builder**: More powerful than Supabase queries
- **Relations**: Automatic relationship handling
- **Migrations**: Better schema versioning
- **Repository Pattern**: Cleaner service code

Your existing API endpoints will work the same, but with better type safety and more powerful query capabilities.
