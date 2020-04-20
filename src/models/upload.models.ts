// TODO: Check usability and remove if needed
// At least need to be renamed bacause of the copy interface name in ./common.models
export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
