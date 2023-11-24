import { ResumeEntity } from '@libs/modules/database/entities/resume/resumeEntity.interface';

export interface QuestionEntity {
  id: number;
  title?: string;
  answer?: string;
  resumeId: number;

  // Relationship
  Resume: ResumeEntity;
}
