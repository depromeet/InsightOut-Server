import { Provider } from '@nestjs/common';
import { ExperienceInfoRepository } from '📚libs/modules/database/repositories/experience-info.repository';
import { ExperienceTransactionRepository } from '📚libs/modules/database/repositories/experience-transaction.repository';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';

export const experienceProviders: Provider[] = [ExperienceRepository, ExperienceInfoRepository, ExperienceTransactionRepository];
