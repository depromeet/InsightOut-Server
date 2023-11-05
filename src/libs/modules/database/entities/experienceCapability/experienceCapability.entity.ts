import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { ExperienceCapabilityEntity } from '@libs/modules/database/entities/experienceCapability/experienceCapabilityEntity.interface';

export class ExperienceCapability extends BaseTimeEntity implements ExperienceCapabilityEntity {
  experienceId: number;
  capabilityId: number;

  // Relationship
  Experience: ExperienceEntity;
  Capability: CapabilityEntity;
}
