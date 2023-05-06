import { HttpStatus } from '@nestjs/common';
import { RouteTable } from '../../decorators/router/route-table.decorator';
import { Route } from '../../decorators/router/route.decorator';
import { GetPrivateIndexResponseDto } from './dto/get-private-index-response.dto';

@RouteTable({
  tag: {
    category: 'private',
    title: '인덱스',
  },
  path: 'private',
})
export class PrivateController {
  @Route({
    summary: '인덱스 페이지',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
      type: GetPrivateIndexResponseDto,
    },
    description: '메인 페이지 설명',
  })
  async index() {
    return {
      text: 'Private Index',
    };
  }
}
