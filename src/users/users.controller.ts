import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiUseTags,
    ApiOkResponse,
    ApiBearerAuth,
    ApiImplicitBody,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';

import { IUser, IRegisterUserData } from '../models/users.models';
import { IAuthReq } from '../models/auth.models';
import { ISqlSuccessResponce } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { registerOptions } from '../swagger/configs';
import { UserDto } from '../swagger/classes/user';

@ApiUseTags(SwaggerTags.Users)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    @ApiOkResponse({ description: 'User list', type: [UserDto] })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public getUserList(): Promise<IUser[]> {
        return this.usersService.getUserList();
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get('/current')
    @ApiOkResponse({ description: 'Current user data', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized error' })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public getCurrentUser(@Request() req: IAuthReq): Promise<IUser> {
        return this.usersService.getUserById(req.user.userId);
    }

    @Post()
    @ApiImplicitBody(registerOptions)
    @ApiCreatedResponse({ description: 'The user was successfully created' })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public registerUser(@Body() registerUserData: IRegisterUserData): Promise<ISqlSuccessResponce> {
        return this.usersService.registerUser(registerUserData);
    }
}
