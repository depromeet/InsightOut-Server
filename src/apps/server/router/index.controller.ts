import { Get } from '@nestjs/common';
import { RouteTable } from '../decorators/router/route-table.decorator';

@RouteTable({
  tag: { title: '인덱스' },
})
export class IndexController {
  @Get()
  async index() {
    return {
      text: 'hello index world',
    };
  }
}
