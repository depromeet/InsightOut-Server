import { AiRecommendQuestionEntity } from '@libs/modules/database/entities/aiRecommendQuestion/aiRecommendQuestionEntity.interface';
import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';

export class AiRecommendQuestion extends BaseTimeEntity implements AiRecommendQuestionEntity {
  id: number;
  title?: string;
  experienceId: number;
  Experience: ExperienceEntity;
}
