import { Provider } from '@nestjs/common';

import { QuestionRepository } from '@libs/modules/database/repositories/question/question.interface';
import { QuestionRepositoryImpl } from '@libs/modules/database/repositories/question/question.repository';
import { ResumeRepository } from '@libs/modules/database/repositories/resume.repository';

export const Repositories: Provider[] = [ResumeRepository, { provide: QuestionRepository, useClass: QuestionRepositoryImpl }];
