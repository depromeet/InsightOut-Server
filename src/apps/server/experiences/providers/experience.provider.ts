import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume/aiResume.interface';
import { AiResumeRepositoryImpl } from '@libs/modules/database/repositories/aiResume/aiResume.repository';
import { CapabilityRepository } from '@libs/modules/database/repositories/capability/capability.interface';
import { CapabilityRepositoryImpl } from '@libs/modules/database/repositories/capability/capability.repository';
import { ExperienceRepository } from '@libs/modules/database/repositories/experience/experience.interface';
import { ExperienceRepositoryImpl } from '@libs/modules/database/repositories/experience/experience.repository';
import { ExperienceCapabilityRepository } from '@libs/modules/database/repositories/experienceCapability/experienceCapability.interface';
import { ExperienceCapabilityRepositoryImpl } from '@libs/modules/database/repositories/experienceCapability/experienceCapability.repository';
import { ExperienceInfoRepository } from '@libs/modules/database/repositories/experienceInfo.repository';

export const experienceProviders = [
  {
    provide: ExperienceRepository,
    useClass: ExperienceRepositoryImpl,
  },
  ExperienceInfoRepository,
  {
    provide: CapabilityRepository,
    useClass: CapabilityRepositoryImpl,
  },
  {
    provide: ExperienceCapabilityRepository,
    useClass: ExperienceCapabilityRepositoryImpl,
  },
  {
    provide: AiResumeRepository,
    useClass: AiResumeRepositoryImpl,
  },
] as const;
