import { HttpStatus } from '@nestjs/common';
import { RouteTable } from '../../decorators/router/route-table.decorator';
import { Route } from '../../decorators/router/route.decorator';

@RouteTable({
  tag: {
    category: 'virtual',
    title: '인덱스',
  },
})
export class VirtualController {
  @Route({
    summary: '데이터 가져오기',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
    },
    description: '메인 페이지 설명',
  })
  async index() {
    return {
      text: 'this is virtual world',
    };
  }
}
