import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ITokenSignPayload, IUserLikePayload } from '../models/auth.models';
import { jwtConstants, USERNAME_FIELD } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretKey,
      usernameField: USERNAME_FIELD,
    });
  }

  public async validate(payload: ITokenSignPayload): Promise<IUserLikePayload> {
    return {
      userId: payload.sub,
      roleId: payload.roleId,
      login: payload.login,
      firstName: payload.firstName,
      lastName: payload.lastName,
      educationalInstitution: payload.educationalInstitution,
      email: payload.email,
      registeredAt: payload.registeredAt,
    };
  }
}
