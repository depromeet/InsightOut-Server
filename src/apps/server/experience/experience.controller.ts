import { Body, HttpStatus, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { Route } from '../common/decorators/router/route.decorator';
import { Method } from '../../../enums/method.enum';
import { RouteTable } from '../common/decorators/router/route-table.decorator';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { ExperienceService } from './experience.service';
import { User } from '../common/decorators/request/user.decorator';
import { ApiBearerAuth, ApiNotFoundResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { CreateExperienceInfoResDto, CreateExperienceInfoUnprocessableErrorResDto } from './dto/res/createExperienceInfo.res.dto';
import { ResponseEntity } from '../../../libs/utils/respone.entity';
import { ExperienceIdParamReqDto } from './dto/req/experienceIdParam.dto';
import { GetExperienceNotFoundErrorResDto, GetExperienceResDto } from './dto/res/getExperience.res.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'experience',
  tag: {
    title: '경험 분해 API',
  },
})
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Route({
    request: {
      method: Method.POST,
      path: '/info',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateExperienceInfoResDto,
    },
    description: '경험 정보 생성 API입니다.',
    summary: '경험 정보 생성API',
  })
  @ApiUnprocessableEntityResponse({
    description: '경험 카드 생성 실패 타입 확인해주세요 :)',
    type: CreateExperienceInfoUnprocessableErrorResDto,
  })
  public async createExperienceInfo(@Body(ValidationPipe) body: CreateExperienceInfoReqDto, @User() user: UserJwtToken) {
    const experience = await this.experienceService.createExperienceInfo(body, user);

    return ResponseEntity.CREATED_WITH_DATA(experience);
  }

  @Route({
    request: {
      method: Method.GET,
      path: '/:experienceId',
    },
    response: {
      code: HttpStatus.OK,
      type: GetExperienceResDto,
    },
    description: '경험 분해 조회 API입니다.',
    summary: '경험 분해 조회 API',
  })
  @ApiNotFoundResponse({
    description: '해당 경험 카드 ID를 확인해주세요 :)',
    type: GetExperienceNotFoundErrorResDto,
  })
  public async getExperience(@Param(ValidationPipe) param: ExperienceIdParamReqDto) {
    const experience = await this.experienceService.getExperience(param.experienceId);

    return ResponseEntity.OK_WITH_DATA(experience);
  }
}
