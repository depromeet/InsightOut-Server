import { Body, Controller, HttpStatus, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { Response } from 'express';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { ACCESS_TOKEN_EXPIRES_IN } from '../common/consts/jwt.const';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { Method } from '📚libs/enums/method.enum';
import { PostIssueTestTokenRequestBodyDto } from '🔥apps/server/test/dtos/post-issue-test-token.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Route({
    request: {
      path: 'token',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: String,
      description:
        '### ✅ 테스트 토큰 발급에 성공했습니다.\n테스트 토큰은 원하는 유저 id를 토큰으로 생성해 요청에서 사용할 수 있습니다.   \n개발 서버에서만 사용 가능합니다. 스웨거의 최상단 Authorize 버튼을 눌러 인가해주세요.',
    },
  })
  async issueTestToken(
    @Body() postIssueTestTokenRequestBodyDto: PostIssueTestTokenRequestBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseEntity<string>> {
    const jwtToken = await this.testService.issueTestToken(postIssueTestTokenRequestBodyDto);

    response.cookie('refreshToken', jwtToken, {
      maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
      httpOnly: true,
    });
    return ResponseEntity.CREATED_WITH_DATA(jwtToken);
  }
}
