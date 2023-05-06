import { HttpStatus } from '@nestjs/common';
import { RouteTable } from '../../decorators/router/route-table.decorator';
import { Route } from '../../decorators/router/route.decorator';
import { GetPublicIndexResponseDto } from './dto/get-public-index-response.dto';

@RouteTable({
  tag: {
    category: 'public',
    title: '인덱스',
  },
  path: 'public',
})
export class PublicController {
  @Route({
    summary: '인덱스 페이지',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
      type: GetPublicIndexResponseDto,
    },
    description: '메인 페이지 설명',
  })
  async index() {
    return new GetPublicIndexResponseDto({
      text: 'Public Index',
    });
  }
}
