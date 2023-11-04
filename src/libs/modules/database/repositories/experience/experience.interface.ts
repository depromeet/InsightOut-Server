import { Experience, ExperienceInfo } from '@prisma/client';

import { ExperienceSelect } from '@apps/server/experiences/interfaces/experienceSelect.interface';

export interface ExperienceRepository {
  selectOneById(experienceId: number, select: ExperienceSelect): Promise<Partial<Experience & { ExperienceInfo?: ExperienceInfo }>>;
  countByUserId(userId: number);
  getExperienceById(experienceId: number);
  getStarFromExperienceByExperienceId(experienceId: number);
  findOneById(experienceid: number, userId: number);
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
  deleteById(experienceId: number);
  getCount;
  getExperiences;
  getExperienceCardInfo;
}

export const ExperienceRepository = Symbol('ExperienceRepository');
