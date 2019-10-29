import { IFullUserData, IUser } from '../models/users.models';
import { Avatar } from '../classes/avatar';

export const getUserFromUserData = (userData: IFullUserData): IUser => {
  const { password, avatarId, avatarLabel, avatarPath, avatarAddedAt, ...otherUserData } = userData;

  const avatar = new Avatar(avatarId, avatarLabel, avatarPath, avatarAddedAt);

  return { ...otherUserData, avatar };
};
