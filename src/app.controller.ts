import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiImplicitBody, ApiInternalServerErrorResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';

import { IAuthReq, ITokenObject } from './models/auth.models';
import { SwaggerTags } from './constants';
import { loginOptions } from './swagger/configs';
import { TokenObjectDto } from './swagger/classes/token';

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
  @ApiInternalServerErrorResponse({ description: 'Server internal error' })
  public login(@Request() req: IAuthReq): Promise<ITokenObject> {
    return this.authService.login(req.user);
  }
}
