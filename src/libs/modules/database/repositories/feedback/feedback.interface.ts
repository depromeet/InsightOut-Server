import { Feedback, Prisma } from '@prisma/client';

export interface FeedbackRepository {
  create(input: Prisma.FeedbackCreateArgs): Promise<Feedback>;
}

export const FeedbackRepository = Symbol('FeedbackRepository');
