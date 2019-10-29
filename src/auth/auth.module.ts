import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secretKey,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    PassportModule,
    AuthService,
  ],
})
export class AuthModule {}
