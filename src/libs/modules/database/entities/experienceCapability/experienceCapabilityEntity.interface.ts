import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';

export interface ExperienceCapabilityEntity {
  experienceId: number;
  capabilityId: number;

  Experience: ExperienceEntity;
  Capability: CapabilityEntity;
}
