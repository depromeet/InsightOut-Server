import { Experience, ExperienceInfo } from '@prisma/client';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { CreateExperienceInfoReqDto } from '../dto/req/createExperienceInfo.dto';

export interface ExperienceTransactionInterface {
  createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]>;
}
