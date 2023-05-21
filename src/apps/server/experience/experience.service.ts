import { Inject, Injectable } from '@nestjs/common';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ExperienceTransactionInterface } from './interface/experience-repository.interface';
import { ExperienceToken } from './provider/injectionToken';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(ExperienceToken.EXPERIENCE_TRANSACTION_REPOSITORY)
    private readonly experienceTransactionRepository: ExperienceTransactionInterface,
  ) {}

  public async createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken) {
    return await this.experienceTransactionRepository.createExperienceInfo(body, user);
  }
}
