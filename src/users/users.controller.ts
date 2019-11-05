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
    ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';

import { IUser, IRegisterUserData } from '../models/users.models';
import { IAuthReq } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { registerOptions } from '../swagger/configs';
import { UserDto } from '../swagger/classes/user';
import { SuccessResponseDto } from '../swagger/classes/success-response';

@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.Users)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    // TODO: Add guard for only Admin access
    @Get()
    @ApiOkResponse({ description: 'User list', type: [UserDto] })
    public getUserList(): Promise<IUser[]> {
        return this.usersService.getUserList();
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get('/current')
    @ApiOkResponse({ description: 'Current user data', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
    @ApiNotFoundResponse({ description: 'User was not found' })
    public getCurrentUser(@Request() req: IAuthReq): Promise<IUser> {
        return this.usersService.getUserById(req.user.userId);
    }

    @Post()
    @ApiImplicitBody(registerOptions)
    @ApiCreatedResponse({ description: 'The user was successfully created', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    public registerUser(@Body() registerUserData: IRegisterUserData): Promise<ISqlSuccessResponse> {
        return this.usersService.registerUser(registerUserData);
    }

    // TODO: Add removing users functionality
}
