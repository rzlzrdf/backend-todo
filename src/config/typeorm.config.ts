import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Todo } from '../entities/todo.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('SUPABASE_DB_HOST') || 'db.supabase.co',
  port: configService.get('SUPABASE_DB_PORT') || 5432,
  username: configService.get('SUPABASE_DB_USER') || 'postgres',
  password: configService.get('SUPABASE_DB_PASSWORD'),
  database: configService.get('SUPABASE_DB_NAME') || 'postgres',
  entities: [User, Todo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
  ssl: {
    rejectUnauthorized: false,
  },
});
