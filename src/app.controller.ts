import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth/auth.service';

import { IAuthReq, ITokenObject } from './models/auth.models';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Request() req: IAuthReq): Promise<ITokenObject> {
    return this.authService.login(req.user);
  }
}
