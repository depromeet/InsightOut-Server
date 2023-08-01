import { Body, Controller, HttpStatus, ParseIntPipe, Query, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { Response } from 'express';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Route } from '🔥apps/server/common/decorators/routers/route.decorator';
import { Method } from '📚libs/enums/method.enum';
import { PostIssueTestTokenRequestBodyDto } from '🔥apps/server/test/dtos/postIssueTestToken.dto';
import { ApiTags } from '@nestjs/swagger';
import { OpenAiService } from '📚libs/modules/open-ai/openAi.service';
import { PromptTestBodydto } from '🔥apps/server/test/dtos/promptTest.bodydto';
import { testApiSuccMd } from '🔥apps/server/test/docs/testApi.md';
import { AuthService } from '🔥apps/server/auth/auth.service';
import { TokenType } from '📚libs/enums/token.enum';
import { TimeoutTestRequestQueryDto } from '🔥apps/server/test/dtos/timeoutTest.dto';
import { SetRequestTimeout } from '🔥apps/server/common/decorators/timeout.decorator';
import { SECOND } from '🔥apps/server/common/consts/time.const';

@ApiTags('🧑🏻‍💻 개발용 API')
@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly authService: AuthService,
    private readonly openAiService: OpenAiService,
  ) {}

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
    const { accessToken, refreshToken } = await this.testService.issueTestToken(postIssueTestTokenRequestBodyDto);

    const accessTokenCookieOptions = this.authService.getCookieOptions(TokenType.AccessToken);
    const refreshTokenCookieOptions = this.authService.getCookieOptions(TokenType.RefreshToken);

    response.cookie('accessToken', accessToken, accessTokenCookieOptions);
    response.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    return ResponseEntity.CREATED_WITH_DATA(accessToken);
  }

  @Route({
    request: {
      path: 'openai',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.OK,
      description: '### ✅ openai prompt 테스트입니다.',
    },
    description: testApiSuccMd,
    summary: '✅ openai 프롬프트 테스트 API',
  })
  async test(@Body() body: PromptTestBodydto) {
    return await this.openAiService.promptChatGPT(body.content);
  }

  @Route({
    request: {
      path: 'timeout',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      description: '### timeout 테스트.',
    },
    description: '# timeout을 테스트합니다.',
    summary: '🛠️ timeout 시간 테스트',
  })
  async timeout(@Query() timeoutTestRequestQueryDto: TimeoutTestRequestQueryDto) {
    function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
    }

    await sleep(timeoutTestRequestQueryDto.time);
    return ResponseEntity.OK_WITH_MESSAGE('Request successfully processed');
  }

  @SetRequestTimeout(SECOND * 40)
  @Route({
    request: {
      path: 'timeout/check',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      description: '### timeout 테스트.',
    },
    description: 'timeout 테스트',
    summary: '🛠️ timeout 시간 테스트',
  })
  async timeoutCheck(@Query() timeoutTestRequestQueryDto: TimeoutTestRequestQueryDto) {
    function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
    }

    await sleep(timeoutTestRequestQueryDto.time);
    return ResponseEntity.OK_WITH_MESSAGE('Request successfully processed');
  }

  @Route({
    request: {
      path: 'random-nickname',
      method: 'GET',
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '랜덤 닉네임 생성기',
    description: '랜덤 닉네임 생성기 테스트를 위해 만들었습니다. 다들 심심할 때 테스트 해보세요~',
  })
  getRandomNickname() {
    const randomNickname = this.testService.getRandomNickname();

    return ResponseEntity.OK_WITH_DATA(randomNickname);
  }
}
