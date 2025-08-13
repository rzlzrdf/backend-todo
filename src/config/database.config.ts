import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Todo } from '../entities/todo.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('SUPABASE_DB_HOST') || 'db.supabase.co',
  port: configService.get('SUPABASE_DB_PORT') || 5432,
  username: configService.get('SUPABASE_DB_USER') || 'postgres',
  password: configService.get('SUPABASE_DB_PASSWORD'),
  database: configService.get('SUPABASE_DB_NAME') || 'postgres',
  entities: [User, Todo],
  synchronize: false, // Set to false in production
  logging: configService.get('NODE_ENV') === 'development',
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    connectionLimit: 10,
  },
});
