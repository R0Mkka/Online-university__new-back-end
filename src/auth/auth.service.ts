import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { IUser, IFullUserData } from '../models/users.models';
import { ITokenObject, ITokenSignPayload, IUserLikePayload } from '../models/auth.models';
import { getUserFromUserData } from '../helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(login: string, passwordToCompare: string): Promise<IUser> {
    const userData: IFullUserData = await this.usersService.getUserByLogin(login);

    if (userData && await bcrypt.compare(passwordToCompare, userData.password)) {
      return getUserFromUserData(userData);
    }

    return null;
  }

  public async login(userPayload: IUserLikePayload): Promise<ITokenObject> {
    const payload: ITokenSignPayload = {
      sub: userPayload.userId,
      roleId: userPayload.roleId,
      login: userPayload.login,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
      educationalInstitution: userPayload.educationalInstitution,
      email: userPayload.email,
      registeredAt: userPayload.registeredAt,
    };

    await this.usersService.addUserEntry(userPayload.userId);

    return {
      token: this.jwtService.sign(payload),
    };
  }

  public logout(user: any): void {
    // TODO:
    // return this.usersService.deleteEnteredUser(user.userId);
  }
}
