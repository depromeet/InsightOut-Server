import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ExperienceCapabilityRepositiryInterface } from '../interface/experience-repository.interface';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { CreateExperienceKeywordBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-keyword.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { Prisma } from '@prisma/client';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { ExperienceCapabilityRepository } from '📚libs/modules/database/repositories/experience-capability.repository';

@Injectable()
export class ExperienceCapabilityService {
  constructor(
    @Inject(ExperienceCapabilityRepository)
    private readonly experienceCapabilityRepository: ExperienceCapabilityRepositiryInterface,
    @Inject(CapabilityRepository)
    private readonly capabilityRepository: CapabilityRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async createManyExperienceCapabilities(body: CreateExperienceKeywordBodyDto, param: ExperienceIdParamReqDto, user: UserJwtToken) {
    const createdInfos = await Promise.all(
      body.keywords.map(async (keyword: string) => {
        const capability = await this.capabilityRepository.findFirst({ where: { userId: user.userId, keyword } });
        if (!capability) throw new NotFoundException(`${keyword} 해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다.`);

        return { experienceId: param.experienceId, capabilityId: capability.id };
      }),
    );

    try {
      return await this.experienceCapabilityRepository.createMany(createdInfos);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new UnprocessableEntityException('키워드가 정상적으로 생성되지 않았습니다. 타입을 확인하세요');
      }
    }
  }
}
