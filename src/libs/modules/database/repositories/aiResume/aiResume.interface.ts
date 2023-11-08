import { AiResume } from '@prisma/client';

export interface AiResumeRepository {
  findOneByUserIdAndExperienceId(userId: number, experienceId: number): Promise<AiResume>;
  findByUserId(userId: number, aiKeyword?: string): Promise<Partial<AiResume>[]>;
  countByUserId(userId: number, aiKeyword?: string): Promise<number>;
}

export const AiResumeRepository = Symbol('AiResumeRepository');
