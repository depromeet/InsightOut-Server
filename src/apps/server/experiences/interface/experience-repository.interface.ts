import { Experience, ExperienceInfo } from '@prisma/client';
import { UpsertExperienceReqDto } from '../dto/req/upsertExperience.dto';
import { ExperienceSelect } from './experience-select.interface';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';

export interface ExperienceTransactionInterface {
  createExperienceInfo(body: UpsertExperienceReqDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]>;
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
