import { Capability, Prisma } from '@prisma/client';

export interface CapabilityRepository {
  findMany(condition: { where: Partial<Capability> });
  findFirst(condition: { where: Partial<Capability> });
  create(data: Prisma.CapabilityCreateArgs);
  countExperienceAndCapability(userId: number, isCompleted?: boolean);
  findByUserId(userId: number): Promise<Capability[]>;
}

export const CapabilityRepository = Symbol('CapabilityRepository');
