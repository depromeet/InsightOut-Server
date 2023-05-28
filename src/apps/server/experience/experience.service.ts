import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';

import { returnValueToDto } from '../common/decorators/returnValueToDto';
import { getExperienceAttribute } from '../common/consts/experience-attribute.const';

import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ExperienceTransactionRepository } from '📚libs/modules/database/repositories/experience-transaction.repository';
import { CreateExperienceResDto } from '🔥apps/server/experiences/dto/res/createExperienceInfo.res.dto';
import { CreateExperienceInfoReqDto } from '🔥apps/server/experiences/dto/req/createExperienceInfo.dto';
import { GetExperienceResDto } from '🔥apps/server/experiences/dto/res/getExperience.res.dto';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly experienceTransactionRepository: ExperienceTransactionRepository,

    private readonly experienceRepository: ExperienceRepository,
  ) {}

  @returnValueToDto(CreateExperienceResDto)
  public async createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<CreateExperienceResDto> {
    const [experience, experienceInfo] = await this.experienceTransactionRepository.createExperienceInfo(body, user);
    if (!experience || !experienceInfo) throw new UnprocessableEntityException('경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요');

    return {
      experienceId: experience.id,
      title: experience.title,
      startDate: experience.startDate,
      endDate: experience.endDate,
      experienceInfo: {
        experienceInfoId: experienceInfo.experienceInfoId,
        experienceRole: experienceInfo.experienceRole,
        motivation: experienceInfo.motivation,
      },
    };
  }

  @returnValueToDto(GetExperienceResDto)
  public async getExperience(experienceId: number): Promise<Partial<GetExperienceResDto>> {
    const experience = await this.experienceRepository.selectOneById(experienceId, getExperienceAttribute);
    if (!experience) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');

    return experience;
  }
}
