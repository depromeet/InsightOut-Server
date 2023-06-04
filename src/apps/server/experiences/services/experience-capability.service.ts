import { BadRequestException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ExperienceCapabilityRepositiryInterface } from '../interface/experience-repository.interface';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { Prisma } from '@prisma/client';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { ExperienceCapabilityRepository } from '📚libs/modules/database/repositories/experience-capability.repository';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';
import { AddCapabilityResDto } from '🔥apps/server/experiences/dto/res/addCapability.res.dto';

@Injectable()
export class ExperienceCapabilityService {
  constructor(
    @Inject(ExperienceCapabilityRepository)
    private readonly experienceCapabilityRepository: ExperienceCapabilityRepositiryInterface,
    @Inject(CapabilityRepository)
    private readonly capabilityRepository: CapabilityRepository,
  ) {}

  public async createManyExperienceCapabilities(
    body: CreateExperienceCapabilitiesdBodyDto,
    param: ExperienceIdParamReqDto,
    user: UserJwtToken,
  ) {
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

  public async addCapability(body: AddCapabilitydBodyDto, user: UserJwtToken): Promise<AddCapabilityResDto> {
    const capability = await this.capabilityRepository.findFirst({ where: { userId: user.userId, keyword: body.keyword } });
    if (capability) throw new BadRequestException(`${body.keyword} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.`);

    const newCapability = await this.capabilityRepository.create({ data: { userId: user.userId, keyword: body.keyword } });

    return new AddCapabilityResDto(newCapability);
  }
}
