import { QuestionRepository } from '../../../modules/database/repositories/question.repository';
import { ResumeRepository } from '../../../modules/database/repositories/resume.repository';

export const Repositories = [ResumeRepository, QuestionRepository] as const;
