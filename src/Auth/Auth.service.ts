import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDTO, LoginDTO, SuccessResponse } from "./dto/Auth.dto";
import { MysqlPoolService } from "src/Utils/mysq.service";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_KEY } from "src/Utils/Contants";
@Injectable()
export class AuthService {
    constructor(
        private readonly mysqlService: MysqlPoolService
    ) { }

    public async CreateUser(
        user: CreateUserDTO
    ): Promise<SuccessResponse | BadRequestException> {
        try {
            if (!user.userName || !user.fullName || !user.phone || !user.district || !user.fullAddress || !user.bloodType || !user.password) {
                throw new BadRequestException("Please provide all the required fields")
            }

            if (user.userName.length < 4) throw new BadRequestException("Username must be at least 4 characters long")
            if (user.userName.includes(" ")) throw new BadRequestException("Username cannot contain spaces")
            if (user.password.length < 8) throw new BadRequestException("Password must be at least 8 characters long")
            if (user.phone.length !== 10) throw new BadRequestException("Phone number must be 10 characters long")
            if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(user.bloodType)) throw new BadRequestException("Invalid blood type")
            user.password = await bcrypt.hash(user.password, 10)
            await this.mysqlService.execute(`
            INSERT INTO users (userName, fullName, phone, district, fullAddress, bloodType, password)
            VALUES (?, ?, ?, ?, ?, ?,?)
            `, [user.userName.toLowerCase(), user.fullName, user.phone, user.district, user.fullAddress, user.bloodType, user.password]
            ).catch((error) => {
                if (error.code === "ER_DUP_ENTRY") {
                    throw new BadRequestException("Username or Phone already exists")
                }
                throw error
            })
            return new SuccessResponse("User created successfully")
        } catch (error) {
            throw error
        }
    }

    public async Login(
        user: LoginDTO
    ): Promise<SuccessResponse | BadRequestException> {
        try {
            if (!user.username || !user.password) throw new BadRequestException("Please provide username and password")

            const userData = await this.mysqlService.execute(`
            SELECT * FROM users WHERE userName = ?
            `, [user.username]
            ).catch((error) => {
                throw error
            })
            if (userData.length === 0) throw new BadRequestException("Invalid username or password")
            const userPassword = userData[0].password
            const isPasswordValid = await bcrypt.compare(user.password, userPassword)
            if (!isPasswordValid) throw new BadRequestException("Invalid username or password")
            const token = jwt.sign({ id: userData[0].userID, userName: userData[0].userName }, JWT_KEY)
            return new SuccessResponse(token, "User login successful")
        } catch (error) {
            throw error
        }
    }
}