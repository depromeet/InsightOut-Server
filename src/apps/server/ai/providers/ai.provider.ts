import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume.repository';
import { CapabilityRepository } from '@libs/modules/database/repositories/capability.repository';

export const aiProviders = [AiResumeRepository, CapabilityRepository] as const;
