import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param, Patch } from '@nestjs/common';
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
import { tryNumberParse } from '../helpers';
import { registerOptions } from '../swagger/configs';
import { UserDto } from '../swagger/classes/user';
import { SuccessResponseDto } from '../swagger/classes/success-response';
import { IChangePasswordData } from 'src/models/user-settings.models';

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
        return this.usersService.getUserById(req.user.userId) as Promise<IUser>;
    }

    @Post()
    @ApiImplicitBody(registerOptions)
    @ApiCreatedResponse({ description: 'The user was successfully created', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    public registerUser(@Body() registerUserData: IRegisterUserData): Promise<ISqlSuccessResponse> {
        return this.usersService.registerUser(registerUserData);
    }

    // TODO: Swagger
    @Patch(':userId')
    public modifyUser(
        @Body() modifyUserData: any, // TODO: Type
        @Param('userId') userIdAsString: string,
    ): Promise<ISqlSuccessResponse> {
        const userId: number = tryNumberParse(userIdAsString);

        return this.usersService.modifyUser(modifyUserData, userId);
    }

    // TODO: Swagger
    @Post(':userId/change-password')
    public changeUserPassword(
        @Body() changePasswordData: IChangePasswordData,
        @Param('userId') userIdAsString: string,
    ): Promise<ISqlSuccessResponse> {
        const userId: number = tryNumberParse(userIdAsString);

        return this.usersService.changeUserPassword(changePasswordData, userId);
    }

    // TODO: Add guard for only Admin access
    @Delete(':userId')
    @ApiOkResponse({ description: 'User was removed (if existed)', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'Id value type is incorrect' })
    public deleteUser(@Param('userId') userIdAsString: string): Promise<ISqlSuccessResponse> {
        const userId: number = tryNumberParse(userIdAsString);

        return this.usersService.deleteUser(userId);
    }
}
