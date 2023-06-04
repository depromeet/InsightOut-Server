import { Body, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import { ExperienceCapabilityService } from '🔥apps/server/experiences/services/experience-capability.service';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';
import { AddCapabilityResDto } from '🔥apps/server/experiences/dto/res/addCapability.res.dto';
import { addCapabilitySuccMd } from '🔥apps/server/experiences/markdown/experience.md';
import { AddCapabilityRequestErrorResDto } from '🔥apps/server/experiences/dto/res/upsertExperienceInfo.res.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience',
  tag: {
    title: '🔭경험 분해 API',
  },
})
export class ExperienceKeywordController {
  constructor(private readonly experienceCapabilityService: ExperienceCapabilityService) {}

  @ApiBadRequestResponse({
    description: '⛔ {가지고 있는 키워드} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.',
    type: AddCapabilityRequestErrorResDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/keyword',
    },
    response: {
      code: HttpStatus.CREATED,
      type: AddCapabilityResDto,
    },
    description: addCapabilitySuccMd,
    summary: '✅ 경험 분해 키워드 추가하기 API',
  })
  public async addCapability(@Body() addCapabilitydBodyDto: AddCapabilitydBodyDto, @User() user: UserJwtToken) {
    const capability = await this.experienceCapabilityService.addCapability(addCapabilitydBodyDto, user);

    return ResponseEntity.CREATED_WITH_DATA(capability);
  }

  @Route({
    request: {
      method: Method.POST,
      path: '/:experienceId/capability',
    },
    response: {
      code: HttpStatus.CREATED,
      // type: UpsertExperienceResDto,
    },
    // description: upsertExperienceSuccMd,
    summary: '✅ 경험 정보 임시 저장 API',
  })
  public async createManyExperienceCapabilities(
    @Body() createExperienceKeywordBodyDto: CreateExperienceCapabilitiesdBodyDto,
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
    @User() user: UserJwtToken,
  ) {
    const experienceCapabilities = await this.experienceCapabilityService.createManyExperienceCapabilities(
      createExperienceKeywordBodyDto,
      experienceIdParamReqDto,
      user,
    );
    return ResponseEntity.CREATED_WITH_DATA(experienceCapabilities);
  }
}
