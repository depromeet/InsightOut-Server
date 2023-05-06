import { HttpStatus } from '@nestjs/common';
import { RouteTable } from '../decorators/router/route-table.decorator';
import { Route } from '../decorators/router/route.decorator';

@RouteTable({
  tag: { title: '인덱스' },
})
export class IndexController {
  @Route({
    summary: '인덱스',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
    },
  })
  async index() {
    return 'Hello, 13th 4team Server';
  }
}
