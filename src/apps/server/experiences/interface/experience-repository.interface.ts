import { Experience, ExperienceInfo } from '@prisma/client';
import { CreateExperienceInfoReqDto } from '../dto/req/createExperienceInfo.dto';
import { ExperienceSelect } from './experience-select.interface';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';

export interface ExperienceTransactionInterface {
  createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]>;
}

export interface ExperienceRepositoryInterface {
  selectOneById(experienceId: number, select: ExperienceSelect): Promise<Partial<Experience & { experienceInfo?: ExperienceInfo }>>;
  selectOneByUserId(
    userId: number,
    select: ExperienceSelect,
  ): Promise<
    Partial<
      Experience & {
        experienceInfo?: ExperienceInfo;
      }
    >
  >;
}
