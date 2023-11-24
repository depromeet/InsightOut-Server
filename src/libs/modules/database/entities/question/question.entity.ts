import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { QuestionEntity } from '@libs/modules/database/entities/question/questionEntity.interface';
import { ResumeEntity } from '@libs/modules/database/entities/resume/resumeEntity.interface';

export class Question extends BaseTimeEntity implements QuestionEntity {
  id: number;
  title?: string;
  answer?: string;
  resumeId: number;

  // Relationship
  Resume: ResumeEntity;
}
