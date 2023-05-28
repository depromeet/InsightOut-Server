import { Provider } from '@nestjs/common';
import { ExperienceInfoRepository } from '../../../../modules/database/repositories/experience-info.repository';
import { ExperienceTransactionRepository } from '../../../../modules/database/repositories/experience-transaction.repository';
import { ExperienceRepository } from '../../../../modules/database/repositories/experience.repository';
import { ExperienceToken } from './injectionToken';

export const experienceProviders: Provider[] = [
  { provide: ExperienceToken.EXPERIENCE_REPOSITORY, useClass: ExperienceRepository },
  { provide: ExperienceToken.EXPERIENCE_INFO_REPOSITORY, useClass: ExperienceInfoRepository },
  { provide: ExperienceToken.EXPERIENCE_TRANSACTION_REPOSITORY, useClass: ExperienceTransactionRepository },
];