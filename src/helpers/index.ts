import { BadRequestException, NotFoundException } from '@nestjs/common';

import { IFullUserData, IUser } from '../models/users.models';
import { Avatar } from '../classes/avatar';

export const getUserFromUserData = (userData: IFullUserData): IUser => {
  const { password, avatarId, avatarLabel, avatarPath, avatarAddedAt, ...otherUserData } = userData;

  const avatar = new Avatar(avatarId, avatarLabel, avatarPath, avatarAddedAt);

  return { ...otherUserData, avatar };
};

export const newBadRequestException = (errorEnv: string): BadRequestException => {
  return new BadRequestException(`[${errorEnv}] Request error!`);
};

export const newNotFoundException = (errorEnv: string): NotFoundException => {
  return new NotFoundException(`[${errorEnv}] Request error!`);
};

export const tryNumberParse = (stringToParse: string, errorMessage?: string): number => {
  const num: number = parseInt(stringToParse, 10);

  if (Number.isNaN(num)) {
    throw new BadRequestException(errorMessage || 'Provided id must be of type number');
  }

  return num;
};
