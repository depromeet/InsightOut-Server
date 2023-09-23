import { QuestionRepository } from '@libs/modules/database/repositories/question.repository';
import { ResumeRepository } from '@libs/modules/database/repositories/resume.repository';

export const Repositories = [ResumeRepository, QuestionRepository] as const;
