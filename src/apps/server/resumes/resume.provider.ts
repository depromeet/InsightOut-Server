import { Provider } from '@nestjs/common';

import { QuestionRepository } from '@libs/modules/database/repositories/question/question.interface';
import { QuestionRepositoryImpl } from '@libs/modules/database/repositories/question/question.repository';
import { ResumeRepository } from '@libs/modules/database/repositories/resume/resume.interface';
import { ResumeRepositoryImpl } from '@libs/modules/database/repositories/resume/resume.repository';

export const Repositories: Provider[] = [
  {
    provide: ResumeRepository,
    useClass: ResumeRepositoryImpl,
  },
  { provide: QuestionRepository, useClass: QuestionRepositoryImpl },
];
