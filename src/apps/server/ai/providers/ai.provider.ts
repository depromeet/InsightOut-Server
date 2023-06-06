import { AiCapabilityRepository } from '📚libs/modules/database/repositories/ai-capability.repository';
import { AiResumeRepository } from '📚libs/modules/database/repositories/ai-resume.repository';

export const aiProviders = [AiResumeRepository, AiCapabilityRepository] as const;
