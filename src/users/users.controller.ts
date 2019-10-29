import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';

import { IUser, IRegisterUserData } from '../models/users.models';
import { IAuthReq } from '../models/auth.models';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    public getUserList(): Promise<IUser[]> {
        return this.usersService.getUserList();
    }

    @UseGuards(AuthGuard())
    @Get('/current')
    public getCurrentUser(@Request() req: IAuthReq): any {
        return this.usersService.getUserById(req.user.userId);
    }

    @Post()
    public registerUser(@Body() registerUserData: IRegisterUserData): any { // TODO: Type
        return this.usersService.registerUser(registerUserData);
    }
}
