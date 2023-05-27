import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ExperienceTransactionInterface } from './interface/experience-repository.interface';
import { ExperienceToken } from './provider/injectionToken';
import { CreateExperienceInfoResDto } from './dto/res/createExperienceInfo.res.dto';
import { returnValueToDto } from '../common/decorators/returnValueToDto';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(ExperienceToken.EXPERIENCE_TRANSACTION_REPOSITORY)
    private readonly experienceTransactionRepository: ExperienceTransactionInterface,
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
}
