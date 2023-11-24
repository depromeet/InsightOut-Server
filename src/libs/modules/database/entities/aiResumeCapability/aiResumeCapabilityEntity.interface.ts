import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';

export interface AiResumeCapabilityEntity {
  aiResumeId: number;
  capabilityId: number;

  AiResume: AiResumeEntity;
  Capability: CapabilityEntity;
}
