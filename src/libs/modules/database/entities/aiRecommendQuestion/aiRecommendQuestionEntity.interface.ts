import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';

export interface AiRecommendQuestionEntity {
  id: number;
  title?: string;
  experienceId: number;

  Experience: ExperienceEntity;
}
