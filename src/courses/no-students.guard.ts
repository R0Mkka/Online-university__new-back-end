import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { IAuthReq, IUserLikePayload } from '../models/auth.models';
import { Roles } from '../models/users.models';

@Injectable()
export class NoStudentsGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const req: IAuthReq = context.switchToHttp().getRequest() as IAuthReq;
        const userPayload: IUserLikePayload = req.user;

        if (userPayload.roleId === Roles.Student) {
            throw new ForbiddenException('This functionality is not available for Students');
        }

        return true;
    }
}
