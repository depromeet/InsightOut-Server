import { AiResumeCapabilityEntity } from '@libs/modules/database/entities/aiResumeCapability/aiResumeCapabilityEntity.interface';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { ExperienceCapabilityEntity } from '@libs/modules/database/entities/experienceCapability/experienceCapabilityEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface CapabilityEntity {
  id: number;
  keyword: string;
  keywordType: KeywordType;
  userId: number;
  experienceId?: number;

  User: UserEntity;
  Experience?: ExperienceEntity;
  ExperienceCapabilities: ExperienceCapabilityEntity[];
  AiResumeCapabilities: AiResumeCapabilityEntity[];
}

export const KeywordType = {
  AI: 'AI',
  USER: 'USER',
} as const;

export type KeywordType = (typeof KeywordType)[keyof typeof KeywordType];
