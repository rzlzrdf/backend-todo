"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.TodoStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var TodoStatus;
(function (TodoStatus) {
    TodoStatus["PENDING"] = "pending";
    TodoStatus["IN_PROGRESS"] = "in_progress";
    TodoStatus["COMPLETED"] = "completed";
})(TodoStatus || (exports.TodoStatus = TodoStatus = {}));
let Todo = class Todo {
    id;
    note;
    status;
    order;
    userId;
    createdAt;
    user;
};
exports.Todo = Todo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Todo.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TodoStatus,
        default: TodoStatus.PENDING,
    }),
    __metadata("design:type", String)
], Todo.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order' }),
    __metadata("design:type", Number)
], Todo.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], Todo.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Todo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.todos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Todo.prototype, "user", void 0);
exports.Todo = Todo = __decorate([
    (0, typeorm_1.Entity)('todolist')
], Todo);
//# sourceMappingURL=todo.entity.js.map