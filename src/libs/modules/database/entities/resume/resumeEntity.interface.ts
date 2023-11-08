import { QuestionEntity } from '@libs/modules/database/entities/question/questionEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface ResumeEntity {
  id: number;
  title: string;
  userId: number;

  // Relationship
  User: UserEntity;
  Questions: QuestionEntity[];
}
