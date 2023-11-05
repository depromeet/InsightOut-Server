import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { AiResumeCapabilityEntity } from '@libs/modules/database/entities/aiResumeCapability/aiResumeCapabilityEntity.interface';
import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';

export class AiResumeCapability extends BaseTimeEntity implements AiResumeCapabilityEntity {
  aiResumeId: number;
  capabilityId: number;

  // Relationship
  AiResume: AiResumeEntity;
  Capability: CapabilityEntity;
}
