import { Injectable, NotFoundException } from '@nestjs/common';
import { UserJwtToken } from '../../auth/types/jwt-token.type';
import { AiRecommendQuestion, AiResume, Experience, ExperienceInfo, ExperienceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { GetExperienceRequestQueryDtoWithPagination } from '🔥apps/server/experiences/dto/req/get-experience.dto';
import { GetStarFromExperienceResponseDto } from '🔥apps/server/experiences/dto/get-star-from-experience.dto';
import { ExperienceCardType } from '🔥apps/server/experiences/types/experience-card.type';
import { PaginationDto } from '📚libs/pagination/pagination.dto';
import { PaginationMetaDto } from '📚libs/pagination/pagination-meta.dto';
import { CreateExperienceResDto } from '🔥apps/server/experiences/dto/res/createExperience.res.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { GetExperienceByIdResDto } from '🔥apps/server/experiences/dto/res/getExperienceById.res.dto';
import { AiResumeRepository } from '📚libs/modules/database/repositories/ai-resume.repository';
import { GetAiResumeResDto } from '🔥apps/server/experiences/dto/res/getAiResume.res.dto';
import {
  AiRecommendQuestionResDto,
  AiResumeResDto,
  GetExperienceCardInfoResDto,
} from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.res.dto';
import {
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
  GetExperiencesResponseDto,
  UpdateExperienceReqDto,
  UpdateExperienceResDto,
} from '🔥apps/server/experiences/dto';
import { CountExperienceAndCapability } from '🔥apps/server/experiences/types/count-experience-and-capability.type';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceRepository: ExperienceRepository,
    private readonly capabilityRepository: CapabilityRepository,
    private readonly aiResumeRepository: AiResumeRepository,
  ) {}

  public async getExperienceById(param: ExperienceIdParamReqDto): Promise<GetExperienceByIdResDto> {
    const experience = await this.experienceRepository.getExperienceById(param.experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');

    return new GetExperienceByIdResDto(experience);
  }

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
          analysis: null,
          experienceId: experience.id,
        },
      });
      return [experience, experienceInfo];
    });

    return new CreateExperienceResDto(experience, experienceInfo);
  }

  public async getExperienceCardInfo(experienceId: number): Promise<GetExperienceCardInfoResDto> {
    const experience = await this.experienceRepository.getExperienceCardInfo(experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 experience가 없습니다.');

    const aiRecommendQuestionResDto = experience.AiRecommendQuestions.map((aiRecommend) => new AiRecommendQuestionResDto(aiRecommend));
    const aiResumeResDto = new AiResumeResDto({
      content: experience.AiResume.content,
      AiResumeCapability: experience.AiResume.AiResumeCapability.map((capability) => capability.Capability.keyword),
    });
    const result: ExperienceCardType = {
      title: experience.title,
      summaryKeywords: experience.summaryKeywords,
      situation: experience.situation,
      startDate: experience.startDate,
      endDate: experience.endDate,
      task: experience.task,
      action: experience.action,
      result: experience.result,
      ExperienceInfo: experience.ExperienceInfo,
      ExperienceCapability: experience.ExperienceCapabilities.map((experienceCapability) => experienceCapability.Capability.keyword),
      AiRecommendQuestion: aiRecommendQuestionResDto,
      AiResume: aiResumeResDto,
    };

    return new GetExperienceCardInfoResDto(result);
  }

  public async getAiResume(param: ExperienceIdParamReqDto, user: UserJwtToken): Promise<GetAiResumeResDto> {
    const where = <Prisma.AiResumeWhereInput>{ userId: user.userId, experienceId: param.experienceId };
    const aiResume = await this.aiResumeRepository.findOneByFilter(where);
    if (!aiResume) throw new NotFoundException('해당 experienceId로 추천된 AI Resuem가 없습니다.');

    return new GetAiResumeResDto({ id: aiResume.id, content: aiResume.content });
  }

  public async update(body: UpdateExperienceReqDto, query: ExperienceIdParamReqDto, user: UserJwtToken): Promise<UpdateExperienceResDto> {
    // 생성 중인 경험 카드가 있는지 확인
    const experinece = await this.experienceRepository.findOneById(query.experienceId, user.userId);
    if (!experinece) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    // 있으면 업데이트
    const updatedExperienceInfo = body.compareProperty(experinece);

    return await this.processUpdateExperience(experinece.id, updatedExperienceInfo);
  }

  public async findOneById(
    experienceId: number,
    userId: number,
  ): Promise<
    Experience & {
      AiResume: AiResume;
      ExperienceInfo: ExperienceInfo;
      AiRecommendQuestions: AiRecommendQuestion[];
    }
  > {
    try {
      const experience = await this.experienceRepository.findOneById(experienceId, userId);

      return experience;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }

  public async getExperiences(
    userId: number,
    query: GetExperienceRequestQueryDtoWithPagination,
  ): Promise<PaginationDto<GetExperiencesResponseDto>> {
    const { pagination, capabilityId, ...select } = query;
    const experience = await this.experienceRepository.getExperiences(userId, select, pagination, capabilityId);
    if (!experience.length) {
      throw new NotFoundException('Experience not found');
    }

    const getExperienceByCapabilityResponseDto: GetExperiencesResponseDto[] = experience.map(
      (experience) => new GetExperiencesResponseDto(experience),
    );

    const itemCount = await this.experienceRepository.getCount(userId);

    const experienceDto = new PaginationDto(
      getExperienceByCapabilityResponseDto,
      new PaginationMetaDto({ itemCount, paginationOptionsDto: pagination }),
    );

    return experienceDto;
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

  public async getCountOfExperienceAndCapability(
    userId: number,
    isCompleted?: boolean,
  ): Promise<GetCountOfExperienceAndCapabilityResponseDto[]> {
    const countOfExperienceAndCapability = await this.capabilityRepository.countExperienceAndCapability(userId, isCompleted);

    // count가 0인 키워드는 필터링합니다.
    const filteredCountOfExperienceAndCapability = countOfExperienceAndCapability.filter(
      (row: CountExperienceAndCapability) => row._count.ExperienceCapabilities !== 0,
    );

    // any타입 죽이기
    const countOfExperienceAndCapabilityResponseDto = filteredCountOfExperienceAndCapability.map(
      (count) => new GetCountOfExperienceAndCapabilityResponseDto(count),
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
