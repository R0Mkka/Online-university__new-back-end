import { IMessageToClient, IMessageToServer } from '../models/chats.models';
import { IUser } from '../models/users.models';

export class MessageToClient implements IMessageToClient {
  public messageId: number;
  public chatId: number;
  public userId: number;
  public userEntryId: number;
  public messageText: string;
  public authorName: string;
  public sentAt: string;
  public isRead: boolean;

  constructor(
    messageId: number,
    messageData: IMessageToServer,
  ) {
    this.messageId = messageId;
    this.chatId = messageData.chatId;
    this.userId = messageData.user.userId;
    this.userEntryId = messageData.user.entryId;
    this.messageText = messageData.messageText;
    this.authorName = this.getAuthorName(messageData.user);
    this.sentAt = Date.now().toString();
    this.isRead = false;
  }

  private getAuthorName(user: IUser): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
