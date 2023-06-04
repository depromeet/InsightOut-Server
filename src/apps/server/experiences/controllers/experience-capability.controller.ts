import { Body, HttpStatus, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import { ExperienceCapabilityService } from '🔥apps/server/experiences/services/experience-capability.service';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';
import { AddCapabilityRequestErrorResDto, AddCapabilityResDto } from '🔥apps/server/experiences/dto/res/addCapability.res.dto';
import { addCapabilitySuccMd, createManyExperienceCapabilitiesSuccMd } from '🔥apps/server/experiences/markdown/experience.md';
import {
  CreateExperienceCapabilitiesResDto,
  CreateExperienceCapabillitiesNotFoundErrorResDto,
} from '🔥apps/server/experiences/dto/res/createExperienceCapabilities.res.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience/capability',
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

  @ApiNotFoundResponse({
    description: '⛔ keywords 중 만들어 있지 않는 것이 있는지 확인해주세요 :)',
    type: CreateExperienceCapabillitiesNotFoundErrorResDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateExperienceCapabilitiesResDto,
    },
    description: createManyExperienceCapabilitiesSuccMd,
    summary: '✅ 경험 정보 임시 저장 API',
  })
  public async createManyExperienceCapabilities(
    @Body() createExperienceKeywordBodyDto: CreateExperienceCapabilitiesdBodyDto,
    @User() user: UserJwtToken,
  ) {
    const experienceCapabilities = await this.experienceCapabilityService.createManyExperienceCapabilities(
      createExperienceKeywordBodyDto,
      user,
    );
    return ResponseEntity.CREATED_WITH_DATA(experienceCapabilities);
  }
}
