import { ExperienceInfoRepository } from '📚libs/modules/database/repositories/experience-info.repository';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';

export const experienceProviders = [ExperienceRepository, ExperienceInfoRepository] as const;
