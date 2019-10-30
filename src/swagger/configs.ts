import { ISwaggerImplicitBody } from './models';

import { LoginDto } from './classes/login';
import { RegisterUserDataDto } from './classes/register';

export const loginOptions: ISwaggerImplicitBody = {
    name: 'LoginDto',
    description: 'Login model',
    type: LoginDto,
};

export const registerOptions: ISwaggerImplicitBody = {
    name: 'RegisterUserDataDto',
    description: 'Register user data model',
    type: RegisterUserDataDto,
};
