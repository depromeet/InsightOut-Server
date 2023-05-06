import { Body, HttpStatus, Query } from '@nestjs/common';
import { RouteTable } from 'src/apps/server/decorators/router/route-table.decorator';
import { Route } from 'src/apps/server/decorators/router/route.decorator';
import { LogService } from 'src/modules/log/log.service';
import { GetVirtualExceptionQueryDto } from './dto/get-virtual-exception-query.dto';
import { PostVirtualExceptionRequestDto } from './dto/post-virtual-exception-request.dto';
import { GetVirtualExceptionResponseDto } from './dto/get-virtual-exception-response.dto';

@RouteTable({
  tag: { title: '에러 테스트', category: 'virtual' },
  path: 'virtual/exception',
})
export class VirtualExceptionController {
  constructor(private readonly logService: LogService) {}
  @Route({
    summary: 'QueryParam Validation 에러 테스트',
    request: {
      method: 'GET',
      path: '',
    },
    response: {
      code: HttpStatus.OK,
    },
  })
  async getExceptionTest(@Query() query: GetVirtualExceptionQueryDto) {
    this.logService.info(
      VirtualExceptionController.name,
      JSON.stringify(query),
    );
    return new GetVirtualExceptionResponseDto({
      ok: true,
    });
  }

  @Route({
    summary: 'Body Validation 에러 테스트',
    request: {
      method: 'POST',
      path: '',
    },
    response: {
      code: HttpStatus.CREATED,
    },
    description: '에러 테스트',
  })
  async postExceptionTest(@Body() body: PostVirtualExceptionRequestDto) {
    this.logService.info(VirtualExceptionController.name, JSON.stringify(body));

    return new GetVirtualExceptionResponseDto({
      ok: true,
    });
  }
}
