export interface ISolutionkAttachment {
  id: number;
  solutionId: number;
  path: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  addedAt: string | null;
}
