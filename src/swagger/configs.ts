import { ISwaggerImplicitBody } from './models';

import { LoginDto } from './classes/login';
import { RegisterUserDataDto } from './classes/register';
import { CreateCourseDto } from './classes/create-course';
import { JoinCourseDto } from './classes/join-course';

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

export const createCourseOptions: ISwaggerImplicitBody = {
    name: 'CreateCourseDto',
    description: 'Create course data model',
    type: CreateCourseDto,
};

export const joinCourseOptions: ISwaggerImplicitBody = {
    name: 'JoinCourseDto',
    description: 'Join course data model',
    type: JoinCourseDto,
};
