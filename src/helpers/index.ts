import { BadRequestException, NotFoundException } from '@nestjs/common';

import { IFullUserData, IUser, IFullCourseUserData, ICourseUser } from '../models/users.models';
import { IChatData, IChatWithImage } from '../models/chats.models';
import { IFile, IShortFile } from '../models/common.models';
import { Image } from '../classes/image';

export const getUserFromUserData = (userData: IFullUserData): IUser => {
  const {
    password,
    avatarId,
    avatarPath,
    avatarName,
    avatarOriginalName,
    avatarMimeType,
    avatarSize,
    avatarAddedAt,
    ...otherUserData
  } = userData;

  const avatar: IFile = new Image(
    avatarId,
    avatarPath,
    avatarName,
    avatarOriginalName,
    avatarMimeType,
    avatarSize,
    avatarAddedAt,
  );

  return { ...otherUserData, avatar };
};

export const getCourseUserFromUserData = (userData: IFullCourseUserData): ICourseUser => {
  const {
    avatarId,
    avatarName,
    avatarMimeType,
    ...otherData
  } = userData;

  const avatar: IShortFile = {
    id: avatarId,
    name: avatarName,
    mimeType: avatarMimeType,
  };

  return { ...otherData, avatar };
};

export const getChatWithImageFromChatData = (chatData: IChatData): IChatWithImage => {
  const {
    imageId,
    imagePath,
    imageName,
    imageOriginalName,
    imageMimeType,
    imageSize,
    imageAddedAt,
    ...otherChatData
  } = chatData;

  const chatImage: IFile = new Image(
    imageId,
    imagePath,
    imageName,
    imageOriginalName,
    imageMimeType,
    imageSize,
    imageAddedAt,
  );

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
