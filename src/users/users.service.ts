import { Model } from "mongoose";
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async signUp(createUserDto: CreateUserDto): Promise<User> {
        // check if email exist
        const checkIfEmailExist = await this.userModel.findOne({email: createUserDto.email})

        if(checkIfEmailExist) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Email address already taken."
                }, HttpStatus.BAD_REQUEST, {
                cause: "Email address already taken."
                });
        }

        const createdUser = await this.userModel.create(createUserDto);
        return createdUser
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find({}).exec();
    }

    async findUserbyEmail(email: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({email: email})
        
        if(!user || !(await this.isPasswordMatch(user.password, password))) {
            throw new UnauthorizedException({status: HttpStatus.UNAUTHORIZED, error: "Incorrect email and password"});
        }

        return user
    }

    async isPasswordMatch(user_password: string, password: string) {
        return await bcrypt.compare(password, user_password);
    }
}