import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitBody,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';

import { IAuthReq, ITokenObject } from './models/auth.models';
import { ISqlSuccessResponse } from './models/common.models';
import { SwaggerTags } from './constants';
import { loginOptions } from './swagger/configs';
import { TokenObjectDto } from './swagger/classes/token';
import { SuccessResponseDto } from './swagger/classes/success-response';

@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiUseTags(SwaggerTags.Login)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiImplicitBody(loginOptions)
  @ApiCreatedResponse({ description: 'Auth Token', type: TokenObjectDto })
  @ApiUnauthorizedResponse({ description: 'Incorrect password' })
  @ApiNotFoundResponse({ description: 'User with such login does not exist' })
  public login(@Request() req: IAuthReq): Promise<ITokenObject> {
    return this.authService.login(req.user);
  }

  @ApiUseTags(SwaggerTags.Logout)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('logout')
  @ApiOkResponse({ description: 'User was logged out successfully', type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
  public logout(@Request() req: IAuthReq): Promise<ISqlSuccessResponse> {
    return this.authService.logout(req.user);
  }
}
