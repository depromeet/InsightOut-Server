import { Body, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { Route } from '../../common/decorators/router/route.decorator';
import { RouteTable } from '../../common/decorators/router/route-table.decorator';
import { User } from '../../common/decorators/request/user.decorator';
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../../auth/types/jwt-token.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';
import { ExperienceCapabilityService } from '🔥apps/server/experiences/services/experience-capability.service';
import { CreateExperienceCapabilitiesdBodyDto } from '🔥apps/server/experiences/dto/req/create-experience-capabilities.dto';
import { AddCapabilitydBodyDto } from '🔥apps/server/experiences/dto/req/add-capability.dto';
import {
  AddUserCapabilityConflictErrorResDto,
  AddUserCapabilityResDto,
} from '🔥apps/server/experiences/dto/res/add-user-capability.res.dto';
import {
  addCapabilitySuccMd,
  createManyExperienceCapabilitiesSuccMd,
  getExperienceCapabilitySuccMd,
} from '🔥apps/server/experiences/markdown/experience.md';
import {
  CreateExperienceCapabilitiesResDto,
  CreateExperienceCapabillitiesNotFoundErrorResDto,
} from '🔥apps/server/experiences/dto/res/createExperienceCapabilities.res.dto';
import { ExperienceIdParamReqDto } from '🔥apps/server/experiences/dto/req/experienceIdParam.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience/capability',
  tag: {
    title: '🔭 경험 분해 API',
  },
})
export class ExperienceKeywordController {
  constructor(private readonly experienceCapabilityService: ExperienceCapabilityService) {}

  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId',
    },
    response: {
      code: HttpStatus.OK,
    },
    description: getExperienceCapabilitySuccMd,
    summary: '🔵 경험 분해 키워드 가져오기 API',
  })
  public async getExperienceCapability(
    @User() user: UserJwtToken,
    @Param() experienceIdParamReqDto: ExperienceIdParamReqDto,
  ): Promise<{ [key in string] }> {
    const experienceCapabilities = await this.experienceCapabilityService.getExperienceCapability(user, experienceIdParamReqDto);

    return ResponseEntity.CREATED_WITH_DATA(experienceCapabilities);
  }

  @ApiConflictResponse({
    description: '⛔ {가지고 있는 키워드} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.',
    type: AddUserCapabilityConflictErrorResDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/keyword',
    },
    response: {
      code: HttpStatus.CREATED,
      type: AddUserCapabilityResDto,
    },
    description: addCapabilitySuccMd,
    summary: '🔵 경험 분해 키워드 추가하기 API',
  })
  public async addUserCapability(@Body() addCapabilitydBodyDto: AddCapabilitydBodyDto, @User() user: UserJwtToken) {
    const capability = await this.experienceCapabilityService.addUserCapability(addCapabilitydBodyDto, user);

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
    summary: '🔵 경험 분해 키워드 임시 저장 API',
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
