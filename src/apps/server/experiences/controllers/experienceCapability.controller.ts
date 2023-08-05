import { Body, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { User } from '@apps/server/common/decorators/req/user.decorator';
import { Route } from '@apps/server/common/decorators/routers/route.decorator';
import { RouteTable } from '@apps/server/common/decorators/routers/routeTable.decorator';
import { AddCapabilitydBodyRequestDto } from '@apps/server/experiences/dto/req/addCapability.dto';
import { CreateExperienceCapabilitiesdBodyRequestDto } from '@apps/server/experiences/dto/req/createExperienceCapabilities.dto';
import { ExperienceIdParamReqDto } from '@apps/server/experiences/dto/req/experienceIdParam.dto';
import { AddUserCapabilityConflictErrorResDto, AddUserCapabilityResponseDto } from '@apps/server/experiences/dto/res/addUserCapability.dto';
import {
  CreateExperienceCapabilitiesResponseDto,
  CreateExperienceCapabillitiesNotFoundErrorResDto,
} from '@apps/server/experiences/dto/res/createExperienceCapabilities.dto';
import { ExperienceCapabilityService } from '@apps/server/experiences/services/experienceCapability.service';
import { Method } from '@libs/enums/method.enum';
import { ResponseEntity } from '@libs/utils/respone.entity';

import { UserJwtToken } from '../../auth/types/jwtToken.type';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import * as ExperienceDocs from '../docs/experience.md';

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
    description: ExperienceDocs.getExperienceCapabilitySuccessMd,
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
      type: AddUserCapabilityResponseDto,
    },
    description: ExperienceDocs.addCapabilitySuccessMd,
    summary: '🔵 경험 분해 키워드 추가하기 API',
  })
  public async addUserCapability(@Body() addCapabilitydBodyDto: AddCapabilitydBodyRequestDto, @User() user: UserJwtToken) {
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
      type: CreateExperienceCapabilitiesResponseDto,
    },
    description: ExperienceDocs.createManyExperienceCapabilitiesSuccessMd,
    summary: '🔵 경험 분해 키워드 임시 저장 API',
  })
  public async createManyExperienceCapabilities(
    @Body() createExperienceKeywordBodyDto: CreateExperienceCapabilitiesdBodyRequestDto,
    @User() user: UserJwtToken,
  ) {
    const experienceCapabilities = await this.experienceCapabilityService.createManyExperienceCapabilities(
      createExperienceKeywordBodyDto,
      user,
    );
    return ResponseEntity.CREATED_WITH_DATA(experienceCapabilities);
  }
}
