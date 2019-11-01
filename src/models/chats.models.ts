import { IImage } from './common.models';
import { IUser } from './users.models';

export interface IChatData {
  chatId: number;
  chatOwnerId: number;
  chatName: string;
  createdAt: string;
  imageId: number;
  imageLabel: string;
  imagePath: string;
  imageAddedAt: string;
}

export interface IChatWithImage {
  chatId: number;
  chatOwnerId: number;
  chatName: string;
  createdAt: string;
  image: IImage;
}

export interface IFullChatData extends IChatWithImage {
  users: IUser[];
  messages: IMessageToClient[];
}

export interface IMessageToServer {
  chatId: number;
  messageText: string;
  user: IUser;
}

export interface IMessageToClient {
  messageId: number;
  chatId: number;
  userId: number;
  userEntryId: number;
  messageText: string;
  authorName: string;
  sentAt: string;
  isRead: boolean;
}
