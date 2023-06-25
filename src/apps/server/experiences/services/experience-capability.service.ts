import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-token.type';
import { Capability, ExperienceCapability, KeywordType, Prisma } from '@prisma/client';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';
import { AddCapabilityResDto } from '🔥apps/server/experiences/dto/res/addCapability.res.dto';
import { CreateExperienceCapabilitiesResDto } from '🔥apps/server/experiences/dto/res/createExperienceCapabilities.res.dto';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { ExperienceCapabilityRepository } from '📚libs/modules/database/repositories/experience-capability.repository';
import { ExperienceCapabilityRepositoryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';

@Injectable()
export class ExperienceCapabilityService {
  constructor(
    @Inject(ExperienceCapabilityRepository)
    private readonly experienceCapabilityRepository: ExperienceCapabilityRepositoryInterface,
    @Inject(CapabilityRepository)
    private readonly capabilityRepository: CapabilityRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async getExperienceCapability(user: UserJwtToken, param: ExperienceIdParamReqDto): Promise<{ [key in string] }> {
    const userCapabilities = await this.capabilityRepository.findMany({ where: { userId: user.userId } });
    const where = { experienceId: param.experienceId };
    const experienceCapabilities = await this.experienceCapabilityRepository.findManyByFilter(where);

    const value = <{ [key in string] }>{};
    userCapabilities.forEach((val: Capability) => {
      value[val.keyword] = false;
    });

    experienceCapabilities.forEach((experienceCapability: ExperienceCapability) => {
      const capability: Capability = userCapabilities.find((capability) => capability.id === experienceCapability.capabilityId);
      if (!capability) throw new NotFoundException(`${capability.keyword} 해당 키워드를 찾을 수 없습니다.`);

      value[capability.keyword] = true;
    });

    return value;
  }

  public async createManyExperienceCapabilities(body: CreateExperienceCapabilitiesdBodyDto, user: UserJwtToken) {
    if (Object.values(body.keywords).filter((val) => val).length >= 5) throw new BadRequestException('키워드는 4개 이상 만들 수 없습니다.');

    const keywords = Object.keys(body.keywords);
    const createdInfos = await this.setCreatedInfos(keywords, body, user);

    try {
      const createPatchPayload = await this.prisma.$transaction(async (tx) => {
        // experienceId가 가지고 있는 keyword모두 삭제
        await tx.experienceCapability.deleteMany({ where: { experienceId: body.experienceId } });
        // 새로 추가할 키워드 생성
        return await tx.experienceCapability.createMany({ data: createdInfos, skipDuplicates: true });
      });

      return new CreateExperienceCapabilitiesResDto(createPatchPayload.count);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new UnprocessableEntityException('키워드가 정상적으로 생성되지 않았습니다. 타입을 확인하세요');
      }
    }
  }

  private async setCreatedInfos(keywords: string[], body: CreateExperienceCapabilitiesdBodyDto, user: UserJwtToken) {
    return await Promise.all(
      keywords.map(async (keyword: string) => {
        if (body.keywords[keyword] === true) {
          const capability = await this.capabilityRepository.findFirst({ where: { userId: user.userId, keyword } });
          if (!capability) throw new NotFoundException(`${keyword} 해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다.`);

          return { experienceId: body.experienceId, capabilityId: capability.id };
        }
      }),
    );
  }

  public async addCapability(body: AddCapabilitydBodyDto, user: UserJwtToken): Promise<AddCapabilityResDto> {
    const capability = await this.capabilityRepository.findFirst({ where: { userId: user.userId, keyword: body.keyword } });
    if (capability) throw new ConflictException(`${body.keyword} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.`);

    const newCapability = await this.capabilityRepository.create({
      data: { userId: user.userId, keyword: body.keyword, keywordType: KeywordType.USER },
    });

    return new AddCapabilityResDto(newCapability);
  }
}
