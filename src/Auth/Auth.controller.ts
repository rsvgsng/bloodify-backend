import { Body, Controller, Get, Put, Req } from "@nestjs/common";
import { AuthService } from "./Auth.service";
import { CreateUserDTO, LoginDTO } from "./dto/Auth.dto";

@Controller("Auth")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Put("CreateUser")
    public async CreateUser(
        @Body() user: CreateUserDTO
    ) {
        return this.authService.CreateUser(user);
    }

    @Put("Login")
    public async Login(
        @Body() user: LoginDTO
    ) {
        return this.authService.Login(user)
    }

}