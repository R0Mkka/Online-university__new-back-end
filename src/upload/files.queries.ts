import { DBTables } from '../constants';

export enum FilesQueryList {
  UploadUserAvatar = 'UploadUserAvatar',
  BindAvatarToUser = 'BindAvatarToUser',
}

export const FilesQueries: { [key in FilesQueryList]: string } = {
  UploadUserAvatar: `
    INSERT INTO ${DBTables.AccountImages} (
      path,
      name,
      originalName,
      mimeType,
      size
    ) VALUES (?,?,?,?,?);
  `,
  
  BindAvatarToUser: `
    UPDATE
      ${DBTables.Users}
    SET
      accountImageId = ?
    WHERE
      userId = ?;
  `,
};
