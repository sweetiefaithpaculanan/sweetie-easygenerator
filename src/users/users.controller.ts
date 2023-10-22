import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto) {
        await this.userService.signUp(createUserDto)
        return {status: HttpStatus.OK, message: "You have successfully signed up!"}
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    } 
}