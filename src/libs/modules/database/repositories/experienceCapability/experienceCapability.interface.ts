import { Prisma, ExperienceCapability } from '@prisma/client';

export interface ExperienceCapabilityRepository {
  createMany(createdInfos: { capabilityId: number; experienceId: number }[]): Promise<Prisma.BatchPayload>;
  deleteByExperienceId(experienceId: number): Promise<Prisma.BatchPayload>;
  findManyByFilter(where: Prisma.ExperienceCapabilityWhereInput): Promise<ExperienceCapability[]>;
}

export const ExperienceCapabilityRepository = Symbol('ExperienceCapabilityRepository');
