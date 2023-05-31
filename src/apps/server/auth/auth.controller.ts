import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SigninRequestBodyDto, SigninResponseDto } from './dtos/post-signin.dto';
import { SigninGuard } from '../common/guards/signin.guard';
import { User } from '../common/decorators/request/user.decorator';
import { AuthService } from './auth.service';
import { UserPayload } from '../common/guards/signin-request-body.interface';
import { Response } from 'express';
import { UserWithRefreshTokenPayload } from './types/jwt-tokwn.type';
import { TokenType } from '📚libs/enums/token.enum';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { Method } from '📚libs/enums/method.enum';

@ApiTags('🔐 권한 관련 API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SigninGuard)
  @Route({
    request: {
      path: 'signin',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: SigninResponseDto,
      description:
        '### ✅ 액세스 토큰을 반환합니다.\n해당 Access token을 Authorization 헤더에 bearer로 넣어서 요청을 보내주세요.   \nswagger 상단 Authorize에 입력하시면 다른 API에서 사용 가능합니다.',
    },
    summary: '소셜 로그인 API입니다. 💬 현재 구글 로그인만 가능합니다.',
    description:
      '# 소셜 로그인 API\n## Description\n구글로그인 시 <code>idToken</code>을 request body에 담아 전달합니다. 만약 유저가 존재한다면, 로그인하며 존재하지 않는다면, 회원가입 처리합니다.   \n이때, 기본 자기소개서와 기본 역량 키워드를 함께 생성합니다. 이후 액세스 토큰을 response body에 담아 응답하며,<code>Set-Cookie</code> 응답 헤더를 통해 refresh token을 쿠키로 설정합니다.\n## Keyword\n해당 API에서 사용하는 정보들입니다.\n1. idToken: 구글에서 해당 유저의 정보를 담은 토큰입니다.\n2. access token: 서버에서 해당 유저의 요청이 인가된 요청인지 파악하며, 인가된 유저의 경우 해당 토큰에서 userId를 추출하여 API 내부에서 사용합니다. **(💬. 유효기간은 1시간입니다.)**   \n3. refresh token: access token이 만료될 시 재발급 받기 위한 토큰입니다. **(💬. 유효 기간은 2주입니다.)**\n## etc.\n- ⛳️[샘플 자기소개서](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=j2n55oy4yPo0noBM-4) - 자기소개서 첫 화면의 2번 항목에 사용됩니다.\n- ⛳️ [직무 역량 키워드](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=765-4685&t=j2n55oy4yPo0noBM-4) - 해당 화면에 기본적으로 들어갈 키워드들입니다.',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 Token입니다.',
  })
  async signin(@Body() _: SigninRequestBodyDto, @User() user: UserPayload, @Res({ passthrough: true }) response: Response) {
    const userId = await this.authService.signin(user);

    const accessToken = this.authService.issueAccessToken(userId);
    const refreshToken = this.authService.issueRefreshToken(userId);

    await this.authService.setRefreshToken(userId, refreshToken);

    const cookieOptions = this.authService.getCookieOptions(TokenType.RefreshToken);

    response.cookie('refreshToken', refreshToken, cookieOptions);
    return { accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('reissue')
  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: 'Refresh token을 사용하여 access token을 재발급합니다.',
  })
  @ApiCreatedResponse({ description: 'access token 재발급 성공' })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 refresh token으로 access token 재발급에 실패했습니다.',
  })
  @ApiBadRequestResponse({ description: '유효하지 않은 요청입니다.' })
  async reissueAccessToken(@User() user: UserWithRefreshTokenPayload, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken } = await this.authService.rotateRefreshToken(user);

    const cookieOptions = this.authService.getCookieOptions(TokenType.RefreshToken);

    response.cookie('refreshToken', refreshToken, cookieOptions);
    return { accessToken };
  }
}
