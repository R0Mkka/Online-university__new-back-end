import { ISwaggerImplicitBody } from './models';

import { LoginDto } from './classes/login';
import { RegisterUserDataDto } from './classes/register';
import { CreateCourseDto } from './classes/create-course';
import { JoinCourseDto } from './classes/join-course';
import { CreateCourseItemDto } from './classes/create-course-item';
import { ModifyCourseItemDto } from './classes/modify-course-item';

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

export const createCourseItemOptions: ISwaggerImplicitBody = {
    name: 'CreateCourseItemDto',
    description: 'Create course item data model',
    type: CreateCourseItemDto,
};

export const modifyCourseItemOptions: ISwaggerImplicitBody = {
    name: 'ModifyCourseItemDto',
    description: 'Modify course item data model',
    type: ModifyCourseItemDto,
};
