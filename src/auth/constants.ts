import { IJwtConstants } from '../models/auth.models';

export const USERNAME_FIELD = 'login';

export const jwtConstants: IJwtConstants = {
  secretKey: process.env.SECRET_KEY,
};
