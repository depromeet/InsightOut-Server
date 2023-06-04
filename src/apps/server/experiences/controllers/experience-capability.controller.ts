import { Body, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import { ExperienceCapabilityService } from '🔥apps/server/experiences/services/experience-capability.service';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';

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

  @Route({
    request: {
      method: Method.POST,
      path: '/keyword',
    },
    response: {
      code: HttpStatus.CREATED,
      // type: UpsertExperienceResDto,
    },
    // description: upsertExperienceSuccMd,
    summary: '✅ 경험 정보 키워드 추가하기 API',
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
