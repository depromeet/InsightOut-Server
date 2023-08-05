import { Body, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';

import { User } from '@apps/server/common/decorators/req/user.decorator';
import { Route } from '@apps/server/common/decorators/routers/route.decorator';
import { RouteTable } from '@apps/server/common/decorators/routers/routeTable.decorator';
import {
  CreateExperienceDto,
  ExperienceIdParamReqDto,
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
  GetExperiencesResponseDto,
  GetExperienceByIdDto,
  GetExperienceNotFoundErrorResDto,
  GetExperienceRequestQueryRequestDto,
  GetStarFromExperienceRequestParamDto,
  GetStarFromExperienceResponseDto,
  UpdateExperienceInfoNotFoundErrorResDto,
  BadRequestErrorResDto,
  UpdateExperienceResDto,
  UpdateExperienceRequestDto,
} from '@apps/server/experiences/dto';
import { GetCountOfExperienceAndCapabilityQueryRequestDto } from '@apps/server/experiences/dto/req/getCountOfExperienceAndCapability.dto';
import { DeleteExperienceResponseDto } from '@apps/server/experiences/dto/res/deleteExperience.dto';
import { GetAiResumeNotFoundException, GetAiResumeResponseDto } from '@apps/server/experiences/dto/res/getAiResume.dto';
import {
  GetExperienceCardInfoNotFoundErrorResDto,
  GetExperienceCardInfoDto,
} from '@apps/server/experiences/dto/res/getExperienceCardInfo.dto';
import { SuccessResponse } from '@libs/decorators/successResponse.dto';
import { Method } from '@libs/enums/method.enum';
import { PaginationDto } from '@libs/pagination/pagination.dto';
import { ResponseEntity } from '@libs/utils/respone.entity';

import { UserJwtToken } from '../../auth/types/jwtToken.type';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import * as ExperienceDocs from '../docs/experience.md';
import { ExperienceService } from '../services/experience.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience',
  tag: {
    title: '🔭 경험 분해 API',
  },
})
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @SuccessResponse(HttpStatus.OK, [
    {
      model: PaginationDto,
      exampleTitle: '페이지가 처음이며, 다음 페이지가 있는 경우',
      exampleDescription: ExperienceDocs.getExperienceFirstPagehavingNextPageDescriptionMd,
      generic: GetExperiencesResponseDto,
    },
    {
      model: PaginationDto,
      exampleTitle: '페이지가 중간일 때(이전 페이지와 다음 페이지가 모두 있는 경우)',
      exampleDescription: ExperienceDocs.getExperienceMiddlePagehavingDescriptionMd,
      overwriteValue: {
        meta: {
          page: 2,
          hasPreviousPage: true,
          hasNextPage: true,
        },
      },
      generic: GetExperiencesResponseDto,
    },
    {
      model: PaginationDto,
      exampleTitle: '페이지가 마지막 이며, 이전 페이지가 있는 경우',
      overwriteValue: {
        meta: {
          page: 3,
          hasNextPage: false,
        },
      },
      exampleDescription: ExperienceDocs.getExperienceLastPagehavingDescriptionMd,
      generic: GetExperiencesResponseDto,
    },
    {
      model: PaginationDto,
      exampleTitle: '페이지가 처음이자, 마지막인 경우(1개의 페이지만 있는 경우)',
      exampleDescription: ExperienceDocs.getExperienceOnePageDescriptionMd,
      overwriteValue: {
        meta: { pageCount: 1, hasNextPage: false },
      },
      generic: GetExperiencesResponseDto,
    },
  ])
  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
      type: GetExperiencesResponseDto,
    },
    description: ExperienceDocs.getExperienceSuccessMd,
    summary: '🔵🟢🟣 경험 분해 조회 API',
  })
  @ApiNotFoundResponse({
    description: '⛔ 해당 경험 카드 ID를 확인해주세요 :)',
    type: GetExperienceNotFoundErrorResDto,
  })
  public async getExperiences(
    @User() user: UserJwtToken,
    @Query() getExperienceRequestQueryDto?: GetExperienceRequestQueryRequestDto,
  ): Promise<ResponseEntity<PaginationDto<GetExperiencesResponseDto>>> {
    const dto = getExperienceRequestQueryDto.toRequestDto();

    const experience = await this.experienceService.getExperiences(user.userId, dto);
    return ResponseEntity.OK_WITH_DATA(experience);
  }

  @Route({
    request: {
      path: '/count',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetCountOfExperienceResponseDto,
      description: ExperienceDocs.getCountOfExperienceResponseDescriptionMd,
    },
    summary: ExperienceDocs.getCountOfExperienceSummaryMd,
    description: ExperienceDocs.getCountOfExperienceDescriptionMd,
  })
  public async getCountOfExperience(@User() user: UserJwtToken): Promise<ResponseEntity<GetCountOfExperienceResponseDto>> {
    const countOfExperience = await this.experienceService.getCountOfExperience(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfExperience);
  }

  @Route({
    request: {
      path: '/capability',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetCountOfExperienceAndCapabilityResponseDto,
      isArray: true,
      description: ExperienceDocs.getCountOfExperienceAndCapabilityResponseDescriptionMd,
    },
    summary: ExperienceDocs.getCountOfExperienceAndCapabilitySummaryMd,
    description: ExperienceDocs.getCountOfExperienceAndCapabilityDescriptionMd,
  })
  public async getCountOfExperienceAndCapability(
    @User() user: UserJwtToken,
    @Query() getCountOfExperienceAndCapabilityQueryReqDto: GetCountOfExperienceAndCapabilityQueryRequestDto,
  ): Promise<ResponseEntity<GetCountOfExperienceAndCapabilityResponseDto[]>> {
    const countOfExperienceAndCapability = await this.experienceService.getCountOfExperienceAndCapability(
      user.userId,
      getCountOfExperienceAndCapabilityQueryReqDto.isCompleted,
    );

    return ResponseEntity.OK_WITH_DATA(countOfExperienceAndCapability);
  }

  // param: experienceId -- 아래로 나려주세요
  @ApiNotFoundResponse({ type: GetAiResumeNotFoundException, description: '⛔ 해당 AI의 추천 자기소개서가 없습니다!' })
  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId/ai-resume',
    },
    response: {
      code: HttpStatus.OK,
      type: GetAiResumeResponseDto,
      description: ExperienceDocs.getAiResumeSuccessMd,
    },
    description: ExperienceDocs.getAiResumeDescriptionMd,
    summary: ExperienceDocs.getAiResumeSummaryMd,
  })
  public async getAiResume(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetAiResumeResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(await this.experienceService.getAiResume(experienceIdParamReqDto, user));
  }

  @ApiNotFoundResponse({
    type: GetExperienceCardInfoNotFoundErrorResDto,
    description: '⛔ 해당 ID의 경험카드는 존재하지 않습니다 아이디를 확인해주세요 :)',
  })
  @Route({
    request: {
      path: '/:experienceId/card-info',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetExperienceCardInfoDto,
      description: ExperienceDocs.getExperienceCardInfoDescriptionMd,
    },
    summary: ExperienceDocs.getExperienceCardInfoSummaryMd,
    description: ExperienceDocs.getExperienceCardInfoSuccessMd,
  })
  public async getExperienceCardInfo(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
  ): Promise<ResponseEntity<GetExperienceCardInfoDto>> {
    const experienceCardInfo = await this.experienceService.getExperienceCardInfo(experienceIdParamReqDto.experienceId);

    return ResponseEntity.OK_WITH_DATA(experienceCardInfo);
  }

  @ApiNotFoundResponse({
    description: '⛔ 해당 ID의 경험카드는 존재하지 않습니다 아이디를 확인해주세요 :)',
    type: UpdateExperienceInfoNotFoundErrorResDto,
  })
  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId',
    },
    response: {
      code: HttpStatus.OK,
      type: GetExperienceByIdDto,
      description: ExperienceDocs.getExperienceByIdSuccessMd,
    },
    description: ExperienceDocs.getExperienceByIdDescriptionMd,
    summary: ExperienceDocs.getExperienceByIdSummaryMd,
  })
  public async getExperienceById(@Param() experienceIdParamReqDto: ExperienceIdParamReqDto): Promise<ResponseEntity<GetExperienceByIdDto>> {
    const experience = await this.experienceService.getExperienceById(experienceIdParamReqDto);

    return ResponseEntity.OK_WITH_DATA(experience);
  }

  // ✅ 경험카드 star 조회
  @Route({
    request: {
      path: '/star/:experienceId',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetStarFromExperienceResponseDto,
      description: ExperienceDocs.getStarFromExperienceResponseDescriptionMd,
    },
    summary: ExperienceDocs.getStarFromExperienceSummaryMd,
    description: ExperienceDocs.getStarFromExperienceDescriptionMd,
  })
  public async getStarFromExperienceByExperienceId(
    @Param() getStarFromExperienceRequestParamDto: GetStarFromExperienceRequestParamDto,
  ): Promise<ResponseEntity<GetStarFromExperienceResponseDto>> {
    const star = await this.experienceService.getStarFromExperienceByExperienceId(getStarFromExperienceRequestParamDto.experienceId);

    return ResponseEntity.OK_WITH_DATA(star);
  }

  //  --POST
  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateExperienceDto,
      description: ExperienceDocs.createExperienceSuccessMd,
    },
    description: ExperienceDocs.createExperienceDescriptionMd,
    summary: ExperienceDocs.createExperienceSummaryMd,
  })
  public async create(@User() user: UserJwtToken): Promise<ResponseEntity<CreateExperienceDto>> {
    const experience = await this.experienceService.create(user);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

  //--PUT
  @ApiBadRequestResponse({
    description: '⛔ 유효성 검사에 실패하였습니다. 타입을 확인해주세요 :)',
    type: BadRequestErrorResDto,
  })
  @ApiNotFoundResponse({
    description: '⛔ 해당 ID의 경험카드는 존재하지 않습니다 아이디를 확인해주세요 :)',
    type: UpdateExperienceInfoNotFoundErrorResDto,
  })
  @Route({
    request: {
      method: Method.PUT,
      path: '/:experienceId',
    },
    response: {
      code: HttpStatus.OK,
      type: UpdateExperienceResDto,
      description: ExperienceDocs.updateExperienceSuccessMd,
    },
    description: ExperienceDocs.updateExperienceDescriptionMd,
    summary: ExperienceDocs.updateExperienceSummaryMd,
  })
  public async update(
    @Body() upsertExperienceReqDto: UpdateExperienceRequestDto,
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<UpdateExperienceResDto>> {
    const experience = await this.experienceService.update(upsertExperienceReqDto, experienceIdParamReqDto, user);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

  //-- DELETE
  @Route({
    request: {
      path: '/:experienceId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
      type: DeleteExperienceResponseDto,
      description: ExperienceDocs.deleteExperienceSuccessMd,
    },
    description: ExperienceDocs.deleteExperienceDescriptionMd,
    summary: ExperienceDocs.deleteExperienceSummaryMd,
  })
  public async deleteExperience(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<DeleteExperienceResponseDto>> {
    const deletedResult = await this.experienceService.deleteExperience(experienceIdParamReqDto, user);
    return ResponseEntity.CREATED_WITH_DATA(deletedResult);
  }
}
