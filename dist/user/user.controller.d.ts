import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("./user.service").User>;
    findAll(): Promise<import("./user.service").User[]>;
    findOne(id: number): Promise<import("./user.service").User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("./user.service").User>;
    remove(id: number): Promise<void>;
}
