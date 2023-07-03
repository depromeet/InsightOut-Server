import { AiResumeRepository } from '📚libs/modules/database/repositories/ai-resume.repository';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';

export const aiProviders = [AiResumeRepository, CapabilityRepository] as const;
