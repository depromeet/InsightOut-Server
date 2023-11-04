import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume/aiResume.interface';
import { AiResumeRepositoryImpl } from '@libs/modules/database/repositories/aiResume/aiResume.repository';
import { CapabilityRepositoryImpl } from '@libs/modules/database/repositories/capability/capability.repository';
import { ExperienceRepository } from '@libs/modules/database/repositories/experience.repository';
import { ExperienceCapabilityRepository } from '@libs/modules/database/repositories/experienceCapability.repository';
import { ExperienceInfoRepository } from '@libs/modules/database/repositories/experienceInfo.repository';

export const experienceProviders = [
  ExperienceRepository,
  ExperienceInfoRepository,
  CapabilityRepositoryImpl,
  ExperienceCapabilityRepository,
  {
    provide: AiResumeRepository,
    useClass: AiResumeRepositoryImpl,
  },
] as const;
