import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

import { IUser } from '../models/users.models';
import { USERNAME_FIELD } from './constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: USERNAME_FIELD,
    });
  }

  public async validate(login: string, password: string): Promise<IUser> {
    const user: IUser = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
