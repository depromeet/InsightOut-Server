import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UpsertExperienceReqDto } from '../dto/req/upsertExperience.dto';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { UpdateExperienceResDto } from '../dto/res/upsertExperienceInfo.res.dto';
import { getExperienceAttribute } from '../../common/consts/experience-attribute.const';
import { GetExperienceByCapabilityResponseDto, GetExperienceResDto } from '../dto/res/getExperience.res.dto';
import { Experience, ExperienceInfo, ExperienceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import {
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
} from '🔥apps/server/experiences/dto/get-count-of-experience-and-capability.dto';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { CountExperienceAndCapability } from '🔥apps/server/experiences/types/count-experience-and-capability.type';
import { GetExperienceRequestQueryDto } from '🔥apps/server/experiences/dto/req/get-experience.dto';
import { GetStarFromExperienceResponseDto } from '🔥apps/server/experiences/dto/get-star-from-experience.dto';
import { ExperienceCardType } from '🔥apps/server/experiences/types/experience-card.type';
import { CreateExperienceResDto } from '🔥apps/server/experiences/dto/res/createExperience.res.dto';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly prisma: PrismaService,
    private readonly capabilityRepository: CapabilityRepository,
  ) {}

  public async create(user: UserJwtToken): Promise<CreateExperienceResDto> {
    const [experience, experienceInfo] = await this.prisma.$transaction(async (tx) => {
      const experience = await tx.experience.create({
        data: {
          title: null,
          startDate: null,
          endDate: null,
          experienceStatus: ExperienceStatus.INPROGRESS,
          situation: null,
          task: null,
          action: null,
          result: null,
          userId: user.userId,
          summaryKeywords: [],
        },
      });

      const experienceInfo = await tx.experienceInfo.create({
        data: {
          experienceRole: null,
          motivation: null,
          utilization: null,
          analysis: null,
          experienceId: experience.id,
        },
      });
      return [experience, experienceInfo];
    });

    return new CreateExperienceResDto(experience, experienceInfo);
  }

  public async getExperienceCardInfo(experienceId: number): Promise<ExperienceCardType> {
    const experience = this.experienceRepository.getExperienceCardInfo(experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 experience가 없습니다.');
    return experience;
  }

  public async update(body: UpsertExperienceReqDto): Promise<UpdateExperienceResDto> {
    // 생성 중인 경험 카드가 있는지 확인
    const experinece = await this.experienceRepository.findOneById(body.experienceId);
    if (!experinece) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    // 있으면 업데이트
    const updatedExperienceInfo = body.compareProperty(experinece);

    return await this.processUpdateExperience(experinece.id, updatedExperienceInfo);
  }

  public async getExperience(experienceId: number): Promise<Partial<GetExperienceResDto>> {
    try {
      const experience = await this.experienceRepository.selectOneById(experienceId, getExperienceAttribute);

      return new GetExperienceResDto(experience);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }

  public async findOneById(experienceId: number): Promise<Experience & { AiResume; ExperienceInfo; AiRecommendQuestion }> {
    try {
      const experience = await this.experienceRepository.findOneById(experienceId);

      return experience;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }

  public async getExperienceByCapability(
    userId: number,
    query: GetExperienceRequestQueryDto,
  ): Promise<GetExperienceByCapabilityResponseDto[]> {
    const { capabilityId, last, ...select } = query;
    const experience = await this.experienceRepository.getExperienceByCapability(userId, capabilityId, select);
    if (!experience.length) {
      throw new NotFoundException('Experience not found');
    }

    const getExperienceByCapabilityResponseDto = experience.map((experience) => new GetExperienceByCapabilityResponseDto(experience));

    return getExperienceByCapabilityResponseDto;
  }

  public async getExperienceByUserId(userId: number): Promise<GetExperienceResDto | string> {
    try {
      const experience = await this.experienceRepository.selectOneByUserId(userId, getExperienceAttribute);
      if (!experience) return 'INPROGRESS 상태의 경험카드가 없습니다';

      return new GetExperienceResDto(experience);
    } catch (error) {
      console.log('error', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('INPROGRESS 상태의 경험카드가 없습니다.');
    }
  }

  public async getExperiencesByUserId(userId: number, query: GetExperienceRequestQueryDto): Promise<GetExperienceResDto[] | string> {
    try {
      const { capabilityId, last, ...select } = query;
      const experience = await this.experienceRepository.findManyByUserId(userId, Object.assign(getExperienceAttribute, select));
      if (!experience.length) return 'INPROGRESS 상태의 경험카드가 없습니다';

      return experience.map((experience) => new GetExperienceResDto(experience));
    } catch (error) {
      console.log('error', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('INPROGRESS 상태의 경험카드가 없습니다.');
    }
  }

  public async processUpdateExperience(
    id: number,
    updatedExperienceInfo: Experience & {
      ExperienceInfo?: ExperienceInfo;
    },
  ): Promise<UpdateExperienceResDto> {
    const [experience, experienceInfo] = await this.prisma.$transaction(async (tx) => {
      const experienceInfo = await tx.experienceInfo.update({
        where: { experienceId: id },
        data: {
          experienceRole: updatedExperienceInfo.ExperienceInfo.experienceRole,
          motivation: updatedExperienceInfo.ExperienceInfo.motivation,
          utilization: updatedExperienceInfo.ExperienceInfo.utilization,
          analysis: updatedExperienceInfo.ExperienceInfo.analysis,
        },
      });

      const experience = await tx.experience.update({
        where: { id },
        data: {
          experienceStatus: updatedExperienceInfo.experienceStatus,
          title: updatedExperienceInfo.title,
          startDate: updatedExperienceInfo.startDate,
          endDate: updatedExperienceInfo.endDate,
          situation: updatedExperienceInfo.situation,
          task: updatedExperienceInfo.task,
          action: updatedExperienceInfo.action,
          result: updatedExperienceInfo.result,
          summaryKeywords: updatedExperienceInfo.summaryKeywords,
        },
      });
      return [experience, experienceInfo];
    });
    return new UpdateExperienceResDto(experience, experienceInfo);
  }

  public async getCountOfExperienceAndCapability(userId: number): Promise<GetCountOfExperienceAndCapabilityResponseDto[]> {
    const countOfExperienceAndCapability = await this.capabilityRepository.countExperienceAndCapability(userId);

    // count가 0인 키워드는 필터링합니다.
    const filteredCountOfExperienceAndCapability = countOfExperienceAndCapability.filter(
      (row: CountExperienceAndCapability) => row._count.ExperienceCapability !== 0,
    );

    if (!filteredCountOfExperienceAndCapability.length) {
      throw new NotFoundException('Experience not found');
    }

    const countOfExperienceAndCapabilityResponseDto = filteredCountOfExperienceAndCapability.map(
      (count) => new GetCountOfExperienceAndCapabilityResponseDto(count as CountExperienceAndCapability),
    );
    return countOfExperienceAndCapabilityResponseDto;
  }

  public async getCountOfExperience(userId: number): Promise<GetCountOfExperienceResponseDto> {
    const countOfExperience = await this.experienceRepository.countExperience(userId);

    const getCountOfExperienceResponseDto = new GetCountOfExperienceResponseDto(countOfExperience);

    return getCountOfExperienceResponseDto;
  }

  // ✅ 경험카드 star 조회
  public async getStarFromExperienceByExperienceId(experienceId: number): Promise<GetStarFromExperienceResponseDto> {
    const star = await this.experienceRepository.getStarFromExperienceByExperienceId(experienceId);

    // 만약 situation, task, action, result 중에서 하나라도 누락됐다면
    if (!(star.situation && star.task && star.action && star.result)) {
      throw new NotFoundException('There are missing info about S, T, A, R');
    }

    const getStarFromExperienceResponseDto = new GetStarFromExperienceResponseDto(star);
    return getStarFromExperienceResponseDto;
  }
}
