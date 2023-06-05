import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';

export const CollectionProviders = [ExperienceRepository, ResumeRepository, CapabilityRepository];
