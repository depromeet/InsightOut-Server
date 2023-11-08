import { AiRecommendQuestionEntity } from '@libs/modules/database/entities/aiRecommendQuestion/aiRecommendQuestionEntity.interface';
import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity, ExperienceStatus } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { ExperienceCapabilityEntity } from '@libs/modules/database/entities/experienceCapability/experienceCapabilityEntity.interface';
import { ExperienceInfoEntity } from '@libs/modules/database/entities/experienceInfo/experienceInfoEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export class Experience extends BaseTimeEntity implements ExperienceEntity {
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

  // Relationship
  User: UserEntity;
  AiResume?: AiResumeEntity;
  ExperienceInfo?: ExperienceInfoEntity;
  Capabilities: CapabilityEntity[];
  ExperienceCapabilities: ExperienceCapabilityEntity[];
  AiRecommendQuestions: AiRecommendQuestionEntity[];
}
