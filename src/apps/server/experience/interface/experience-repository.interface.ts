import { Experience, ExperienceInfo } from '@prisma/client';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { CreateExperienceInfoReqDto } from '../dto/req/createExperienceInfo.dto';
import { ExperienceSelect } from './experience-select.interface';

export interface ExperienceTransactionInterface {
  createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]>;
}

export interface ExperienceReposirotyInterface {
  selectOneById(experienceId: number, select: ExperienceSelect): Promise<Partial<Experience & { experienceInfo?: ExperienceInfo }>>;
}
