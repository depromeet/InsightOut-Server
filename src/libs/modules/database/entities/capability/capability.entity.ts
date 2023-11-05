import { AiResumeCapabilityEntity } from '@libs/modules/database/entities/aiResumeCapability/aiResumeCapabilityEntity.interface';
import { CapabilityEntity, KeywordType } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { ExperienceCapabilityEntity } from '@libs/modules/database/entities/experienceCapability/experienceCapabilityEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export class Capability extends BaseTimeEntity implements CapabilityEntity {
  id: number;
  keyword: string;
  keywordType: KeywordType;
  userId: number;
  experienceId?: number;

  // Relationship
  User: UserEntity;
  Experience?: ExperienceEntity;
  ExperienceCapabilities: ExperienceCapabilityEntity[];
  AiResumeCapabilities: AiResumeCapabilityEntity[];
}
