export interface ICourseTaskAttachment {
  id: number;
  courseTaskId: number;
  path: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  addedAt: string | null;
}
