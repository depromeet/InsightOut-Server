import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { AiResumeCapabilityEntity } from '@libs/modules/database/entities/aiResumeCapability/aiResumeCapabilityEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export class AiResume extends BaseTimeEntity implements AiResumeEntity {
  id: number;
  content: string;
  userId: number;
  experienceId?: number;

  // Relationship
  User: UserEntity;
  Experience: ExperienceEntity;
  AiResumeCapabilities: AiResumeCapabilityEntity[];
}
