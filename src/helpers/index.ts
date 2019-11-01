import { BadRequestException, NotFoundException } from '@nestjs/common';

import { IFullUserData, IUser } from '../models/users.models';
import { IChatData, IChatWithImage } from '../models/chats.models';
import { IImage } from '../models/common.models';
import { Image } from '../classes/image';

export const getUserFromUserData = (userData: IFullUserData): IUser => {
  const { password, avatarId, avatarLabel, avatarPath, avatarAddedAt, ...otherUserData } = userData;

  const avatar: IImage = new Image(avatarId, avatarLabel, avatarPath, avatarAddedAt);

  return { ...otherUserData, avatar };
};

export const getChatWithImageFromChatData = (chatData: IChatData): IChatWithImage => {
  const { imageId, imageLabel, imagePath, imageAddedAt, ...otherChatData } = chatData;

  const chatImage: IImage = new Image(imageId, imageLabel, imagePath, imageAddedAt);

  return { ...otherChatData, image: chatImage };
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
