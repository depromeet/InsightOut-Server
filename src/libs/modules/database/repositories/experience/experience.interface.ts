import { Experience, ExperienceInfo } from '@prisma/client';

import { ExperienceSelect } from '@apps/server/experiences/interfaces/experienceSelect.interface';

export interface ExperienceRepository {
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

export const ExperienceRepository = Symbol('ExperienceRepository');
