import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async signIn(email, password) {
        const user = await this.usersService.findUserbyEmail(email, password)

        if(user) {
            const payload = {sub: user.email, name: user.name, email: user.email}

            return {
                user: user,
                access_token: await this.jwtService.signAsync(payload)
            }
        }
    }
}