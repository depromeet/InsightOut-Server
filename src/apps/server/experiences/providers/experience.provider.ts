import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { ExperienceCapabilityRepository } from '📚libs/modules/database/repositories/experienceCapability.repository';
import { ExperienceInfoRepository } from '📚libs/modules/database/repositories/experienceInfo.repository';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { AiResumeRepository } from '📚libs/modules/database/repositories/aiResume.repository';

export const experienceProviders = [
  ExperienceRepository,
  ExperienceInfoRepository,
  CapabilityRepository,
  ExperienceCapabilityRepository,
  AiResumeRepository,
] as const;
