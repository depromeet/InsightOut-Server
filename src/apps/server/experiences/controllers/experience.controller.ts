import { Body, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { UpdateExperienceReqDto } from '../dto/req/updateExperience.dto';
import { ExperienceService } from '../services/experience.service';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import {
  BadRequestErrorResDto,
  UpsertExperienceInfoNotFoundErrorResDto,
  UpdateExperienceResDto,
} from '../dto/res/updateExperienceInfo.res.dto';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { GetExperienceNotFoundErrorResDto, GetExperienceResDto } from '../dto/res/getExperience.res.dto';
import { Method } from '📚libs/enums/method.enum';
import {
  createExperienceDescriptionMd,
  createExperienceSuccMd,
  createExperienceSummaryMd,
  getExperienceByIdDescriptionMd,
  getExperienceByIdSuccMd,
  getExperienceByIdSummaryMd,
  getExperienceSuccMd,
  updateExperienceDescriptionMd,
  updateExperienceSuccMd,
  updateExperienceSummaryMd,
} from '🔥apps/server/experiences/markdown/experience.md';
import { GetExperienceRequestQueryDto } from '🔥apps/server/experiences/dto/req/get-experience.dto';
import {
  GetCountOfExperienceAndCapabilityDescriptionMd,
  GetCountOfExperienceAndCapabilityResponseDescriptionMd,
  GetCountOfExperienceAndCapabilitySummaryMd,
} from '../markdown/get-count-of-experience-and-capability.doc';
import {
  GetCountOfExperienceAndCapabilityResponseDto,
  GetCountOfExperienceResponseDto,
} from '🔥apps/server/experiences/dto/get-count-of-experience-and-capability.dto';
import {
  GetCountOfExperienceDescriptionMd,
  GetCountOfExperienceResponseDescriptionMd,
  GetCountOfExperienceSummaryMd,
} from '🔥apps/server/experiences/markdown/get-count-of-experience.md';
import {
  GetStarFromExperienceRequestParamDto,
  GetStarFromExperienceResponseDto,
} from '🔥apps/server/experiences/dto/get-star-from-experience.dto';
import {
  GetStarFromExperienceDescriptionMd,
  GetStarFromExperienceResponseDescriptionMd,
  GetStarFromExperienceSummaryMd,
} from '🔥apps/server/experiences/markdown/get-star-from-experience.md';
import { CreateExperienceResDto } from '🔥apps/server/experiences/dto/res/createExperience.res.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';

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
    type: UpsertExperienceInfoNotFoundErrorResDto,
  })
  @Route({
    request: {
      method: Method.PUT,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: UpdateExperienceResDto,
      description: updateExperienceSuccMd,
    },
    description: updateExperienceDescriptionMd,
    summary: updateExperienceSummaryMd,
  })
  public async update(@Body() upsertExperienceReqDto: UpdateExperienceReqDto): Promise<ResponseEntity<UpdateExperienceResDto>> {
    const experience = await this.experienceService.update(upsertExperienceReqDto);

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

    // TODO service로 넘어가기 전에 DTO 한 번 더 wrapping하기
    if (getExperienceRequestQueryDto.capabilityId) {
      experience = await this.experienceService.getExperienceByCapability(user.userId, getExperienceRequestQueryDto);
    } else {
      // TODO 추후 전체 모아보기를 위해 수정 필요
      experience = await this.experienceService.getExperiencesByUserId(user.userId, getExperienceRequestQueryDto);
    }

    if (getExperienceRequestQueryDto.last) {
      experience = experience[0];
    }

    return ResponseEntity.OK_WITH_DATA(experience);
  }

  //TODO:
  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId',
    },
    response: {
      code: HttpStatus.OK,
      // type: GetExperienceResDto,
      description: getExperienceByIdSuccMd,
    },
    description: getExperienceByIdDescriptionMd,
    summary: getExperienceByIdSummaryMd,
  })
  public async getExperienceById(@Param() experienceIdParamReqDto: ExperienceIdParamReqDto) {
    const experience = await this.experienceService.getExperienceById(experienceIdParamReqDto);

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
