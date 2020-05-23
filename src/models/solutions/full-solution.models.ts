import { ISolution } from './solution.models';
import { ISolutionkAttachment } from './solution-attachment.models';

export interface IFullSolution extends ISolution {
  attachments: ISolutionkAttachment[];
}
