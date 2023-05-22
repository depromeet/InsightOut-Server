import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ExperienceReposirotyInterface, ExperienceTransactionInterface } from './interface/experience-repository.interface';
import { ExperienceToken } from './provider/injectionToken';
import { CreateExperienceInfoResDto } from './dto/res/createExperienceInfo.res.dto';
import { returnValueToDto } from '../common/decorators/returnValueToDto';

import { Experience } from '@prisma/client';
import { getExperienceAttribute } from '../common/consts/experience-attribute.const';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(ExperienceToken.EXPERIENCE_TRANSACTION_REPOSITORY)
    private readonly experienceTransactionRepository: ExperienceTransactionInterface,

    @Inject(ExperienceToken.EXPERIENCE_REPOSITORY)
    private readonly experienceRepository: ExperienceReposirotyInterface,
  ) {}

  @returnValueToDto(CreateExperienceInfoResDto)
  public async createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<CreateExperienceInfoResDto> {
    const [experience, experienceInfo] = await this.experienceTransactionRepository.createExperienceInfo(body, user);
    if (!experience || !experienceInfo) throw new UnprocessableEntityException('경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요');

    return {
      experienceId: experience.id,
      title: experience.title,
      startDate: experience.startDate,
      endDate: experience.endDate,
      experienceInfoId: experienceInfo.experienceInfoId,
      experienceRole: experienceInfo.experienceRole,
      motivate: experienceInfo.motivate,
    };
  }

  public async getExperience(experienceId: number): Promise<Experience> {
    const experience = await this.experienceRepository.selectOneById(experienceId, getExperienceAttribute);
    if (!experience) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');

    return experience;
  }
}
