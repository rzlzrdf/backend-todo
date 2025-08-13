"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const todo_entity_1 = require("../entities/todo.entity");
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('SUPABASE_DB_HOST') || 'db.supabase.co',
    port: configService.get('SUPABASE_DB_PORT') || 5432,
    username: configService.get('SUPABASE_DB_USER') || 'postgres',
    password: configService.get('SUPABASE_DB_PASSWORD'),
    database: configService.get('SUPABASE_DB_NAME') || 'postgres',
    entities: [user_entity_1.User, todo_entity_1.Todo],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: {
        rejectUnauthorized: false,
    },
    extra: {
        connectionLimit: 10,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map