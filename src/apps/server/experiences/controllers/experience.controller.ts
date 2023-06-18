import { Body, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { ExperienceService } from '../services/experience.service';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import {
  BadRequestErrorResDto,
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
  GetExperienceNotFoundErrorResDto,
  GetExperienceRequestQueryDto,
  GetExperienceResDto,
  GetStarFromExperienceRequestParamDto,
  GetStarFromExperienceResponseDto,
  UpsertExperienceInfoUnprocessableErrorResDto,
  UpsertExperienceReqDto,
  UpsertExperienceResDto,
} from '🔥apps/server/experiences/dto';
import {
  upsertExperienceSuccMd,
  getExperienceSuccMd,
  GetCountOfExperienceAndCapabilityResponseDescriptionMd,
  GetCountOfExperienceAndCapabilitySummaryMd,
  GetCountOfExperienceAndCapabilityDescriptionMd,
  GetCountOfExperienceResponseDescriptionMd,
  GetCountOfExperienceSummaryMd,
  GetCountOfExperienceDescriptionMd,
  GetStarFromExperienceResponseDescriptionMd,
  GetStarFromExperienceSummaryMd,
  GetStarFromExperienceDescriptionMd,
} from '🔥apps/server/experiences/markdown';

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

  @ApiBadRequestResponse({
    description: '⛔ 유효성 검사에 실패하였습니다. 타입을 확인해주세요 :)',
    type: BadRequestErrorResDto,
  })
  @ApiUnprocessableEntityResponse({
    description: '⛔ 경험 카드 생성 실패 타입 확인해주세요 :)',
    type: UpsertExperienceInfoUnprocessableErrorResDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: UpsertExperienceResDto,
    },
    description: upsertExperienceSuccMd,
    summary: '✅ 경험 정보 생성 및 업데이트 API',
  })
  public async upsertExperience(@Body() upsertExperienceReqDto: UpsertExperienceReqDto, @User() user: UserJwtToken) {
    const experience = await this.experienceService.upsertExperience(upsertExperienceReqDto, user);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
      type: GetExperienceResDto,
      // TODO: Swagger에서 Pagination에 따라 다른 Example 보여주기
      // type: PaginationDto<GetExperienceResDto>,
    },
    description: getExperienceSuccMd,
    summary: '✅ 경험 분해 조회 API',
  })
  @ApiNotFoundResponse({
    description: '⛔ 해당 경험 카드 ID를 확인해주세요 :)',
    type: GetExperienceNotFoundErrorResDto,
  })
  public async getExperience(@User() user: UserJwtToken, @Query() body?: GetExperienceRequestQueryDto) {
    let experience;

    const dto = body.toRequestDto();

    // TODO service로 넘어가기 전에 DTO 한 번 더 wrapping하기
    if (dto.capabilityId) {
      experience = await this.experienceService.getExperienceByCapability(user.userId, dto);
    } else {
      // TODO 추후 전체 모아보기를 위해 수정 필요
      experience = await this.experienceService.getExperiencesByUserId(user.userId, dto);
    }

    return ResponseEntity.OK_WITH_DATA(experience);
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
