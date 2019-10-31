import { IImage } from './common.models';
import { IUser } from './users.models';

export interface IFullChatData {
  chatId: number;
  chatOwnerId: number;
  chatName: string;
  createdAt: string;
  imageId: number;
  imageLabel: string;
  imagePath: string;
  imageAddedAt: string;
}

export interface IChat {
  chatId: number;
  chatOwnerId: number;
  chatName: string;
  createdAt: string;
  image: IImage;
  users: IUser[];
  messages: any[]; // TODO: Type
}
