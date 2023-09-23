import { Injectable, NotFoundException } from '@nestjs/common';
import { AiRecommendQuestion, AiResume, Experience, ExperienceCapability, ExperienceInfo, ExperienceStatus, Prisma } from '@prisma/client';

import {
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
  GetExperiencesResponseDto,
  UpdateExperienceRequestDto,
  UpdateExperienceResDto,
} from '@apps/server/experiences/dto';
import { ExperienceIdParamReqDto } from '@apps/server/experiences/dto/req/experienceIdParam.dto';
import { GetExperienceRequestQueryDtoWithPagination } from '@apps/server/experiences/dto/req/getExperience.dto';
import { GetStarFromExperienceResponseDto } from '@apps/server/experiences/dto/req/getStarFromExperience.dto';
import { CreateExperienceDto } from '@apps/server/experiences/dto/res/createExperience.dto';
import { DeleteExperienceResponseDto } from '@apps/server/experiences/dto/res/deleteExperience.dto';
import { GetAiResumeResponseDto } from '@apps/server/experiences/dto/res/getAiResume.dto';
import { GetExperienceByIdDto } from '@apps/server/experiences/dto/res/getExperienceById.dto';
import {
  AiRecommendQuestionResponseDto,
  AiResumeResDto,
  GetExperienceCardInfoDto,
} from '@apps/server/experiences/dto/res/getExperienceCardInfo.dto';
import { CountExperienceAndCapability } from '@apps/server/experiences/types/countExperienceAndCapability.type';
import { ExperienceCardType } from '@apps/server/experiences/types/experienceCard.type';
import { PrismaService } from '@libs/modules/database/prisma.service';
import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume.repository';
import { CapabilityRepository } from '@libs/modules/database/repositories/capability.repository';
import { ExperienceRepository } from '@libs/modules/database/repositories/experience.repository';
import { PaginationDto } from '@libs/pagination/pagination.dto';
import { PaginationMetaDto } from '@libs/pagination/paginationMeta.dto';

import { UserJwtToken } from '../../auth/types/jwtToken.type';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceRepository: ExperienceRepository,
    private readonly capabilityRepository: CapabilityRepository,
    private readonly aiResumeRepository: AiResumeRepository,
  ) {}

  public async getExperienceById(param: ExperienceIdParamReqDto): Promise<GetExperienceByIdDto> {
    const experience = await this.experienceRepository.getExperienceById(param.experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');

    return new GetExperienceByIdDto(experience);
  }

  public async create(user: UserJwtToken): Promise<CreateExperienceDto> {
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

    return new CreateExperienceDto(experience, experienceInfo);
  }

  public async getExperienceCardInfo(experienceId: number): Promise<GetExperienceCardInfoDto> {
    const experience = await this.experienceRepository.getExperienceCardInfo(experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 experience가 없습니다.');

    const aiRecommendQuestionResDto = experience.AiRecommendQuestions.map((aiRecommend) => new AiRecommendQuestionResponseDto(aiRecommend));
    const aiResumeResDto = new AiResumeResDto({
      content: experience.AiResume?.content,
      AiResumeCapability: experience.AiResume?.AiResumeCapabilities.map((aiResumeCapability) => aiResumeCapability.Capability.keyword),
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
      experienceStatus: experience.experienceStatus,
      ExperienceInfo: experience.ExperienceInfo,
      ExperienceCapability: experience.ExperienceCapabilities.map((experienceCapability) => experienceCapability.Capability.keyword),
      AiRecommendQuestion: aiRecommendQuestionResDto,
      AiResume: aiResumeResDto,
    };

    return new GetExperienceCardInfoDto(result);
  }

  public async getAiResume(param: ExperienceIdParamReqDto, user: UserJwtToken): Promise<GetAiResumeResponseDto> {
    const where = <Prisma.AiResumeWhereInput>{ userId: user.userId, experienceId: param.experienceId };
    const aiResume = await this.aiResumeRepository.findOneByFilter(where);
    if (!aiResume) throw new NotFoundException('해당 experienceId로 추천된 AI Resuem가 없습니다.');

    return new GetAiResumeResponseDto({ id: aiResume.id, content: aiResume.content });
  }

  public async update(
    body: UpdateExperienceRequestDto,
    query: ExperienceIdParamReqDto,
    user: UserJwtToken,
  ): Promise<UpdateExperienceResDto> {
    // 생성 중인 경험 카드가 있는지 확인
    const experience = await this.experienceRepository.findOneById(query.experienceId, user.userId);
    if (!experience) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    // 있으면 업데이트
    const updatedExperienceInfo = body.compareProperty(experience);

    return await this.processUpdateExperience(experience.id, updatedExperienceInfo);
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

    const itemCount = await this.experienceRepository.getCount(userId, select, capabilityId);

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
      AiResume?: AiResume;
    },
  ): Promise<UpdateExperienceResDto> {
    const [experience, experienceInfo, aiResume] = await this.prisma.$transaction(async (tx) => {
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

      let aiResume = null;
      if (updatedExperienceInfo && updatedExperienceInfo?.AiResume) {
        aiResume = await tx.aiResume.upsert({
          where: { experienceId: id },
          create: updatedExperienceInfo.AiResume,
          update: updatedExperienceInfo.AiResume,
        });
      }

      return [experience, experienceInfo, aiResume];
    });
    return new UpdateExperienceResDto(experience, experienceInfo, aiResume);
  }

  public async getCountOfExperienceAndCapability(
    userId: number,
    isCompleted?: boolean,
  ): Promise<GetCountOfExperienceAndCapabilityResponseDto[]> {
    let countOfExperienceAndCapability = await this.capabilityRepository.countExperienceAndCapability(userId, isCompleted);
    countOfExperienceAndCapability = countOfExperienceAndCapability
      .map((experienceAndCapability) => {
        const validExperienceAndCapability = experienceAndCapability.ExperienceCapabilities.filter((ExperienceCapability) =>
          this.checkExperienceIsValid(ExperienceCapability.Experience, isCompleted),
        );

        if (validExperienceAndCapability.length > 0) {
          experienceAndCapability.ExperienceCapabilities = validExperienceAndCapability;
          return experienceAndCapability;
        }
      })
      .filter((experienceAndCapability) => experienceAndCapability);

    // 전체(경험카드 개수)를 가져오기 위한 count문 만들기 >> ID를 0으로 넣자
    const totalCountOfCapabilities = countOfExperienceAndCapability.reduce((prev, curr) => prev + curr.ExperienceCapabilities.length, 0);

    countOfExperienceAndCapability.unshift({
      id: 0,
      keyword: '전체',
      _count: { ExperienceCapabilities: totalCountOfCapabilities },
    } as unknown as CountExperienceAndCapability);

    // count가 0인 키워드는 필터링합니다.
    const filteredCountOfExperienceAndCapability = countOfExperienceAndCapability.filter(
      (row: CountExperienceAndCapability) => row._count.ExperienceCapabilities !== 0,
    );

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

    if (!star) {
      throw new NotFoundException('완성한 경험카드의 S, T, A, R이 없습니다.');
    }

    // 만약 situation, task, action, result 중에서 하나라도 누락됐다면
    if (!(star.situation && star.task && star.action && star.result)) {
      throw new NotFoundException('There are missing info about S, T, A, R');
    }

    const getStarFromExperienceResponseDto = new GetStarFromExperienceResponseDto(star);
    return getStarFromExperienceResponseDto;
  }

  public async deleteExperience(param: ExperienceIdParamReqDto, user: UserJwtToken): Promise<DeleteExperienceResponseDto> {
    const experinece = await this.experienceRepository.findOneById(param.experienceId, user.userId);
    if (!experinece) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');

    // experience가 존재하면 삭제
    const deletedResult = await this.experienceRepository.deleteOneById(param.experienceId);
    // 삭제 시 해당 experience의 값을 반환합니다 해당 id와 삭제하려는 experience id가 같으면 isDeleted를 true를 다르면 false를 반환합니다.
    return deletedResult.id === experinece.id ? new DeleteExperienceResponseDto(true) : new DeleteExperienceResponseDto(false);
  }

  checkExperienceIsValid(
    experience: Partial<Experience> & {
      ExperienceInfo: Partial<ExperienceInfo>;
      AiResume: Partial<AiResume>;
      ExperienceCapabilities: Partial<ExperienceCapability>[];
      AiRecommendQuestions: Partial<AiRecommendQuestion>[];
    },
    isCompleted = false,
  ) {
    return (
      experience.title &&
      experience.situation &&
      experience.task &&
      experience.action &&
      experience.result &&
      experience.startDate instanceof Date &&
      experience.endDate instanceof Date &&
      experience.ExperienceCapabilities.length &&
      (isCompleted ? experience.experienceStatus === ExperienceStatus.DONE : true)
    );
  }
}
