import { FeedbackEntity } from '@libs/modules/database/entities/feedback/feedbackEntity.interface';

export class Feedback implements FeedbackEntity {
  id: number;
  contents: string;
  createdAt: Date;
}
