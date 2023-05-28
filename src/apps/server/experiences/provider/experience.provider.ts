import { ExperienceInfoRepository } from '../../../../modules/database/repositories/experience-info.repository';
import { ExperienceRepository } from '../../../../modules/database/repositories/experience.repository';

export const experienceProviders = [ExperienceRepository, ExperienceInfoRepository] as const;
