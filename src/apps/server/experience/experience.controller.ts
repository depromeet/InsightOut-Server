import { Body, HttpStatus, UseGuards, ValidationPipe } from '@nestjs/common';
import { Route } from '../common/decorators/router/route.decorator';
import { Method } from '../../../enums/method.enum';
import { RouteTable } from '../common/decorators/router/route-table.decorator';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { ExperienceService } from './experience.service';
import { User } from '../common/decorators/request/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';

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
      code: HttpStatus.OK,
    },
    description: '경험 정보 생성 API입니다.',
    summary: '경험 정보 생성API',
  })
  public async createExperienceInfo(
    @Body(ValidationPipe) body: CreateExperienceInfoReqDto,
    @User() user: UserJwtToken,
  ) {
    return this.experienceService.createExperienceInfo(body, user);
  }
}
