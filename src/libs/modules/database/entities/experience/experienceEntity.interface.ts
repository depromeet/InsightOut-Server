import { AiRecommendQuestionEntity } from '@libs/modules/database/entities/aiRecommendQuestion/aiRecommendQuestionEntity.interface';
import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { ExperienceCapabilityEntity } from '@libs/modules/database/entities/experienceCapability/experienceCapabilityEntity.interface';
import { ExperienceInfoEntity } from '@libs/modules/database/entities/experienceInfo/experienceInfoEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface ExperienceEntity {
  id: number;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  experienceStatus: ExperienceStatus;
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
  summaryKeywords: string[];
  userId: number;

  User: UserEntity;
  AiResume?: AiResumeEntity;
  ExperienceInfo?: ExperienceInfoEntity;
  Capabilities: CapabilityEntity[];
  ExperienceCapabilities: ExperienceCapabilityEntity[];
  AiRecommendQuestions: AiRecommendQuestionEntity[];
}

export const ExperienceStatus = {
  INPROGRESS: 'INPROGRESS', // 진행중
  DONE: 'DONE', // 끝
} as const;

export type ExperienceStatus = (typeof ExperienceStatus)[keyof typeof ExperienceStatus];
