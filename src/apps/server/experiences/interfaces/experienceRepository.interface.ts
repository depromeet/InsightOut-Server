import { Experience, ExperienceCapability, ExperienceInfo, Prisma } from '@prisma/client';

import { UserJwtToken } from '@apps/server/auth/types/jwtToken.type';
import { UpdateExperienceRequestDto } from '@apps/server/experiences/dto';

import { ExperienceSelect } from './experienceSelect.interface';

export interface ExperienceTransactionInterface {
  createExperienceInfo(body: UpdateExperienceRequestDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]>;
}

export interface ExperienceRepositoryInterface {
  selectOneById(experienceId: number, select: ExperienceSelect): Promise<Partial<Experience & { ExperienceInfo?: ExperienceInfo }>>;
  selectOneByUserId(
    userId: number,
    select: ExperienceSelect,
  ): Promise<
    Partial<
      Experience & {
        ExperienceInfo?: ExperienceInfo;
      }
    >
  >;
  findOneByUserId(userId: number): Promise<Experience>;
}

export interface ExperienceCapabilityRepositoryInterface {
  createMany(createdInfos: { capabilityId: number; experienceId: number }[]): Promise<Prisma.BatchPayload>;
  deleteByExperienceId(experienceId: number): Promise<Prisma.BatchPayload>;
  findManyByFilter(where: Prisma.ExperienceCapabilityWhereInput): Promise<ExperienceCapability[]>;
}
