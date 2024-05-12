import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { JWT_KEY } from "src/Utils/Contants";

@Injectable()
export class AuthGuard implements CanActivate {

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        const token = headers?.authorization?.split(' ')[1];
        if (!token) return false
        try {
            let isVerified = jwt.verify(token, JWT_KEY)
            request.id = isVerified['id']
            request.userName = isVerified['userName']

            if (isVerified) return true
        } catch (error) {
            return false
        }

    }
}
function InjectModel(arg0: string): (target: typeof AuthGuard, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error("Function not implemented.");
}

