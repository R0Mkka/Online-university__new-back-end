import { Roles } from './users.models';

export interface IJwtConstants {
  secretKey: string;
}

export interface ITokenObject {
  token: string;
}

export interface IAuthReq {
  user: IUserLikePayload;
}

export interface ITokenSignPayload {
  sub: number;
  roleId: Roles;
  login: string;
  firstName: string;
  lastName: string;
  educationalInstitution: string;
  email: string;
  registeredAt: string;
}

export interface IUserLikePayload {
  userId: number;
  roleId: Roles;
  login: string;
  firstName: string;
  lastName: string;
  educationalInstitution: string;
  email: string;
  registeredAt: string;
}
