import { HttpStatus } from '@nestjs/common';
import { Route } from '../common/decorators/router/route.decorator';
import { Method } from '../../../enums/method.enum';
import { RouteTable } from '../common/decorators/router/route-table.decorator';

@RouteTable({
  path: 'experience',
  tag: {
    title: '경험 분해 API',
  },
})
export class ExperienceController {
  @Route({
    request: {
      method: Method.POST,
      path: '/info',
    },
    response: {
      code: HttpStatus.OK,
    },
    description: '유저 생성 API입니다.',
    summary: '유저 생성API.',
  })
  public async createExperience() {}
}
