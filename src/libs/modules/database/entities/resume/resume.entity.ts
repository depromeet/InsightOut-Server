import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { QuestionEntity } from '@libs/modules/database/entities/question/questionEntity.interface';
import { ResumeEntity } from '@libs/modules/database/entities/resume/resumeEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export class Resume extends BaseTimeEntity implements ResumeEntity {
  id: number;
  title: string;
  userId: number;

  // Relationship
  User: UserEntity;
  Questions: QuestionEntity[];
}
