import { Body, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { UpdateExperienceReqDto } from '../dto/req/updateExperience.dto';
import { ExperienceService } from '../services/experience.service';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-token.type';
import {
  BadRequestErrorResDto,
  UpdateExperienceInfoNotFoundErrorResDto,
  UpdateExperienceResDto,
} from '../dto/res/updateExperienceInfo.res.dto';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import {
  CreateExperienceResDto,
  ExperienceIdParamReqDto,
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
  GetExperienceByIdResDto,
  GetExperienceNotFoundErrorResDto,
  GetExperienceRequestQueryDto,
  GetExperienceResDto,
  GetStarFromExperienceRequestParamDto,
  GetStarFromExperienceResponseDto,
} from '🔥apps/server/experiences/dto';
import {
  GetCountOfExperienceAndCapabilityDescriptionMd,
  GetCountOfExperienceAndCapabilityResponseDescriptionMd,
  GetCountOfExperienceAndCapabilitySummaryMd,
  GetCountOfExperienceDescriptionMd,
  GetCountOfExperienceResponseDescriptionMd,
  GetCountOfExperienceSummaryMd,
  GetStarFromExperienceDescriptionMd,
  GetStarFromExperienceResponseDescriptionMd,
  GetStarFromExperienceSummaryMd,
  createExperienceDescriptionMd,
  createExperienceSuccMd,
  createExperienceSummaryMd,
  getExperienceByIdDescriptionMd,
  getExperienceByIdSuccMd,
  getExperienceByIdSummaryMd,
  getExperienceFirstPagehavingNextPageDescriptionMd,
  getExperienceLastPagehavingDescriptionMd,
  getExperienceMiddlePagehavingDescriptionMd,
  getExperienceOnePageDescriptionMd,
  getExperienceSuccMd,
  updateExperienceDescriptionMd,
  updateExperienceSuccMd,
  updateExperienceSummaryMd,
  getAiResumeSuccMd,
  getAiResumeDescriptionMd,
  getAiResumeSummaryMd,
  getExperienceCardInfoSuccMd,
  getExperienceCardInfoSummaryMd,
  getExperienceCardInfoDescriptionMd,
} from '🔥apps/server/experiences/markdown';
import { GetAiResumeNotFoundException, GetAiResumeResDto } from '🔥apps/server/experiences/dto/res/getAiResume.res.dto';
import { GetExperienceCardInfoNotFoundErrorResDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.res.dto';
import { SuccessResponse } from '📚libs/decorators/success-response.dto';
import { PaginationDto } from '📚libs/pagination/pagination.dto';
import { GetExperienceCardInfoResDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.res.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience',
  tag: {
    title: '🔭경험 분해 API',
  },
})
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateExperienceResDto,
      description: createExperienceSuccMd,
    },
    description: createExperienceDescriptionMd,
    summary: createExperienceSummaryMd,
  })
  public async create(@User() user: UserJwtToken): Promise<ResponseEntity<CreateExperienceResDto>> {
    const experience = await this.experienceService.create(user);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

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
      description: updateExperienceSuccMd,
    },
    description: updateExperienceDescriptionMd,
    summary: updateExperienceSummaryMd,
  })
  public async update(
    @Body() upsertExperienceReqDto: UpdateExperienceReqDto,
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
  ): Promise<ResponseEntity<UpdateExperienceResDto>> {
    const experience = await this.experienceService.update(upsertExperienceReqDto, experienceIdParamReqDto);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

  @SuccessResponse(HttpStatus.OK, [
    {
      model: PaginationDto,
      exampleTitle: '페이지가 처음이며, 다음 페이지가 있는 경우',
      exampleDescription: getExperienceFirstPagehavingNextPageDescriptionMd,
      generic: GetExperienceResDto,
    },
    {
      model: PaginationDto,
      exampleTitle: '페이지가 중간일 때(이전 페이지와 다음 페이지가 모두 있는 경우)',
      exampleDescription: getExperienceMiddlePagehavingDescriptionMd,
      overwriteValue: {
        meta: {
          page: 2,
          hasPreviousPage: true,
          hasNextPage: true,
        },
      },
      generic: GetExperienceResDto,
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
      exampleDescription: getExperienceLastPagehavingDescriptionMd,
      generic: GetExperienceResDto,
    },
    {
      model: PaginationDto,
      exampleTitle: '페이지가 처음이자, 마지막인 경우(1개의 페이지만 있는 경우)',
      exampleDescription: getExperienceOnePageDescriptionMd,
      overwriteValue: {
        meta: { pageCount: 1, hasNextPage: false },
      },
      generic: GetExperienceResDto,
    },
  ])
  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
    },
    description: getExperienceSuccMd,
    summary: '✅ 경험 분해 조회 API',
  })
  @ApiNotFoundResponse({
    description: '⛔ 해당 경험 카드 ID를 확인해주세요 :)',
    type: GetExperienceNotFoundErrorResDto,
  })
  public async getExperiences(@User() user: UserJwtToken, @Query() getExperienceRequestQueryDto?: GetExperienceRequestQueryDto) {
    let experience;

    const dto = getExperienceRequestQueryDto.toRequestDto();

    // TODO service로 넘어가기 전에 DTO 한 번 더 wrapping하기
    if (dto.capabilityId) {
      experience = await this.experienceService.getExperienceByCapability(user.userId, dto);
    } else {
      // TODO 추후 전체 모아보기를 위해 수정 필요
      experience = await this.experienceService.getExperiencesByUserId(user.userId, dto);
    }

    return ResponseEntity.OK_WITH_DATA(experience);
  }

  @ApiNotFoundResponse({ type: GetAiResumeNotFoundException, description: '⛔ 해당 AI의 추천 자기소개서가 없습니다!' })
  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId/ai-resume',
    },
    response: {
      code: HttpStatus.OK,
      type: GetAiResumeResDto,
      description: getAiResumeSuccMd,
    },
    description: getAiResumeDescriptionMd,
    summary: getAiResumeSummaryMd,
  })
  public async getAiResume(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetAiResumeResDto>> {
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
      type: GetExperienceCardInfoResDto,
      description: getExperienceCardInfoDescriptionMd,
    },
    summary: getExperienceCardInfoSummaryMd,
    description: getExperienceCardInfoSuccMd,
  })
  public async getExperienceCardInfo(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
  ): Promise<ResponseEntity<GetExperienceCardInfoResDto>> {
    const experienceCardInfo = await this.experienceService.getExperienceCardInfo(experienceIdParamReqDto.experienceId);

    return ResponseEntity.OK_WITH_DATA(experienceCardInfo);
  }

  @Route({
    request: {
      path: '/count',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetCountOfExperienceResponseDto,
      description: GetCountOfExperienceResponseDescriptionMd,
    },
    summary: GetCountOfExperienceSummaryMd,
    description: GetCountOfExperienceDescriptionMd,
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
      description: GetCountOfExperienceAndCapabilityResponseDescriptionMd,
    },
    summary: GetCountOfExperienceAndCapabilitySummaryMd,
    description: GetCountOfExperienceAndCapabilityDescriptionMd,
  })
  public async getCountOfExperienceAndCapability(
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetCountOfExperienceAndCapabilityResponseDto[]>> {
    const countOfExperienceAndCapability = await this.experienceService.getCountOfExperienceAndCapability(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfExperienceAndCapability);
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
      type: GetExperienceByIdResDto,
      description: getExperienceByIdSuccMd,
    },
    description: getExperienceByIdDescriptionMd,
    summary: getExperienceByIdSummaryMd,
  })
  public async getExperienceById(
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
  ): Promise<ResponseEntity<GetExperienceByIdResDto>> {
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
      description: GetStarFromExperienceResponseDescriptionMd,
    },
    summary: GetStarFromExperienceSummaryMd,
    description: GetStarFromExperienceDescriptionMd,
  })
  public async getStarFromExperienceByExperienceId(
    @Param() getStarFromExperienceRequestParamDto: GetStarFromExperienceRequestParamDto,
  ): Promise<ResponseEntity<GetStarFromExperienceResponseDto>> {
    const star = await this.experienceService.getStarFromExperienceByExperienceId(getStarFromExperienceRequestParamDto.experienceId);

    return ResponseEntity.OK_WITH_DATA(star);
  }
}
