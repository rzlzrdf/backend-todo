"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
const todo_entity_1 = require("../entities/todo.entity");
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('SUPABASE_DB_HOST') || 'db.supabase.co',
    port: configService.get('SUPABASE_DB_PORT') || 5432,
    username: configService.get('SUPABASE_DB_USER') || 'postgres',
    password: configService.get('SUPABASE_DB_PASSWORD'),
    database: configService.get('SUPABASE_DB_NAME') || 'postgres',
    entities: [user_entity_1.User, todo_entity_1.Todo],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: {
        rejectUnauthorized: false,
    },
});
//# sourceMappingURL=typeorm.config.js.map