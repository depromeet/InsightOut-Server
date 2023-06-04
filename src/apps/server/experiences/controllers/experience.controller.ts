import { Body, HttpStatus, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { UpsertExperienceReqDto } from '../dto/req/upsertExperience.dto';
import { ExperienceService } from '../services/experience.service';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { UpsertExperienceInfoUnprocessableErrorResDto, UpsertExperienceResDto } from '../dto/res/upsertExperienceInfo.res.dto';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { GetExperienceNotFoundErrorResDto, GetExperienceResDto } from '../dto/res/getExperience.res.dto';
import { Method } from '📚libs/enums/method.enum';
import { getExperienceSuccMd, upsertExperienceSuccMd } from '🔥apps/server/experiences/markdown/experience.md';
import { BadRequestErrorResDto } from '🔥apps/server/experiences/dto/res/addCapability.res.dto';

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
    },
    description: getExperienceSuccMd,
    summary: '✅ 경험 분해 조회 API',
  })
  @ApiNotFoundResponse({
    description: '⛔ 해당 경험 카드 ID를 확인해주세요 :)',
    type: GetExperienceNotFoundErrorResDto,
  })
  public async getExperience(@User() user: UserJwtToken) {
    const experience = await this.experienceService.getExperienceByUserId(user.userId);

    return ResponseEntity.OK_WITH_DATA(experience);
  }
}
