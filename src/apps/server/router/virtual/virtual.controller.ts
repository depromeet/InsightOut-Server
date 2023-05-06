import { HttpStatus } from '@nestjs/common';
import { RouteTable } from '../../decorators/router/route-table.decorator';
import { Route } from '../../decorators/router/route.decorator';
import { GetVirtualIndexResponseDto } from './dto/get-virtual-index-response.dto';

@RouteTable({
  tag: {
    category: 'virtual',
    title: '인덱스',
  },
  path: 'virtual',
})
export class VirtualController {
  @Route({
    summary: '인덱스 페이지',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
      type: GetVirtualIndexResponseDto,
    },
    description: '메인 페이지 설명',
  })
  async index() {
    return {
      text: 'Virtual Index',
    };
  }
}
