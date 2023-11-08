import { AiResumeCapabilityEntity } from '@libs/modules/database/entities/aiResumeCapability/aiResumeCapabilityEntity.interface';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface AiResumeEntity {
  id: number;
  content: string;
  userId: number;
  experienceId?: number;

  User: UserEntity;
  Experience: ExperienceEntity;
  AiResumeCapabilities: AiResumeCapabilityEntity[];
}
