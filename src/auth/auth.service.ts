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

  public async login({
    userId,
    roleId,
    login,
    firstName,
    lastName,
    educationalInstitution,
    email,
    registeredAt,
  }: IUserLikePayload): Promise<ITokenObject> {

    const payload: ITokenSignPayload = {
      sub: userId,
      roleId,
      login,
      firstName,
      lastName,
      educationalInstitution,
      email,
      registeredAt,
    };

    await this.usersService.addUserEntry(userId);

    return {
      token: this.jwtService.sign(payload),
    };
  }

  public logout(user: any): void {
    // TODO:
    // return this.usersService.deleteEnteredUser(user.userId);
  }
}
