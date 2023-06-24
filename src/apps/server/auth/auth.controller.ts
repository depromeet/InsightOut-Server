import { Body, Controller, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SigninGuard } from '../common/guards/signin.guard';
import { User } from '../common/decorators/request/user.decorator';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserWithRefreshTokenPayload } from './types/jwt-tokwn.type';
import { TokenType } from '📚libs/enums/token.enum';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { Method } from '📚libs/enums/method.enum';
import { PostReissueResponseDto } from '🔥apps/server/auth/dtos/post-reissue.dto';
import { PostSigninRequestBodyDto, PostSigninResponseDto, UserPayload } from '🔥apps/server/auth/dtos/post-signin.dto';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { OnboardingsService } from '🔥apps/server/onboarding/onboarding.service';
import { GetAllOnboardingsResponseDto } from '🔥apps/server/onboarding/dtos/get-onboarding.dto';

@ApiTags('🔐 권한 관련 API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly onboardingsService: OnboardingsService) {}

  @UseGuards(SigninGuard)
  @Route({
    request: {
      path: 'signin',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: PostSigninResponseDto,
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
  async signin(
    @Body() _: PostSigninRequestBodyDto,
    @User() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseEntity<PostSigninResponseDto>> {
    const { userId, nickname } = await this.authService.signin(user);

    const accessToken = this.authService.issueAccessToken(userId);
    const refreshToken = this.authService.issueRefreshToken(userId);

    await this.authService.setRefreshToken(userId, refreshToken);

    const accessTokenCookieOptions = this.authService.getCookieOptions(TokenType.AccessToken);
    const refreshTokenCookieOptions = this.authService.getCookieOptions(TokenType.RefreshToken);

    response.cookie('accessToken', accessToken, accessTokenCookieOptions);
    response.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    const onboarding = await this.onboardingsService.getAllOnboardings(userId);

    return ResponseEntity.CREATED_WITH_DATA(Object.assign(new PostSigninResponseDto(accessToken, onboarding, userId, nickname)));
  }

  @UseGuards(JwtRefreshGuard)
  @Route({
    request: {
      path: 'reissue',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: PostReissueResponseDto,
      description:
        '### ✅ 액세스 토큰을 갱신합니다.\n해당 Access token을 Authorization 헤더에 bearer로 넣어서 요청을 보내주세요.   \nswagger 상단 Authorize에 입력하시면 다른 API에서 사용 가능합니다.',
    },
    summary: '액세스 토큰 재발급 API입니다. Access token이 만료됐을 시 사용해주세요.',
    description:
      '# 액세스 토큰 재발급 API\n## Description\nRefresh token을 사용하여 access token을 재발급합니다.   \nRefresh token의 기한이 만료되지 않고, redis에 저장된 토큰과 같을 때(유효한 토큰일 때) access token을 반환합니다.   \nRefresh token의 주기를 짧게 가져가 보안을 강화하기 위해 refresh token도 재발급합니다.\n## Keyword\n해당 API에서 사용하는 정보들입니다.\n1. access token: 서버에서 해당 유저의 요청이 인가된 요청인지 파악하며, 인가된 유저의 경우 해당 토큰에서 userId를 추출하여 API 내부에서 사용합니다. **(💬. 유효기간은 1시간입니다.)**   \n2. refresh token: access token이 만료될 시 재발급 받기 위한 토큰입니다. **(💬. 유효 기간은 2주입니다.)**\n## etc.\n- ⛳️[샘플 자기소개서](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=j2n55oy4yPo0noBM-4) - 자기소개서 첫 화면의 2번 항목에 사용됩니다.\n- ⛳️ [직무 역량 키워드](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=765-4685&t=j2n55oy4yPo0noBM-4) - 해당 화면에 기본적으로 들어갈 키워드들입니다.',
  })
  @ApiCreatedResponse({ description: 'access token 재발급 성공' })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 refresh token으로 access token 재발급에 실패했습니다.',
  })
  @ApiBadRequestResponse({ description: '유효하지 않은 요청입니다.' })
  async reissueAccessToken(
    @User() user: UserWithRefreshTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseEntity<PostReissueResponseDto>> {
    const { accessToken, refreshToken } = await this.authService.rotateRefreshToken(user);

    const accessTokenCookieOptions = this.authService.getCookieOptions(TokenType.AccessToken);
    const refreshTokenCookieOptions = this.authService.getCookieOptions(TokenType.RefreshToken);

    response.cookie('accessToken', accessToken, accessTokenCookieOptions);
    response.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    return ResponseEntity.CREATED_WITH_DATA(new PostReissueResponseDto(accessToken));
  }

  /**
   * 유저 회원 탈퇴 API입니다.
   * JwtRefreshGaurd를 통해서 유저가 Refresh Token을 가지고 있는지 확인합니다.
   * Redis에 저장된 Refresh Token과 같은지 검증하기 위함입니다.
   * 반환값은 없습니다.
   */
  @UseGuards(JwtRefreshGuard)
  @Route({
    request: {
      path: 'withdraw',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
      type: String,
      description:
        '### ✅ 회원 탈퇴에 성공했습니다.\nRefresh token을 redis에서 삭제하며, firebase Authentication 서비스에서 유저를 삭제합니다.',
    },
    summary: '회원 탈퇴 API',
    description:
      '# 회원 탈퇴 API\n## Description\n회원 탈퇴를 진행합니다. 해당 유저의 Refresh Token을 받아서 삭제합니다.\n## Response\n반환값은 없습니다.\n## etc.\n⛳️ [마이페이지 회원탈퇴](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1418-10972&t=PibZzDLncZrUbrLe-4)',
  })
  async withdraw(
    @User() user: UserWithRefreshTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseEntity<string>> {
    await this.authService.withdraw(user);

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return ResponseEntity.OK_WITH_MESSAGE('User withdrawed');
  }

  /**
   * ## Refresh 토큰을 받아 로그아웃을 처리하는 API
   *
   * Refresh token을 삭제하여 로그인할 때까지 서비스를 사용하지 못하도록 해야 하므로,
   * Refresh token을 입력으로 받고 최종적으로 token들을 삭제합니다.
   */
  @UseGuards(JwtRefreshGuard)
  @Route({
    request: {
      path: 'signout',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.OK,
      type: String,
      description:
        '### ✅ 로그아웃에 성공했습니다.\nRefresh token이 같으므로, 유효한 토큰이라 판단해 redis에서 삭제합니다. 회원탈퇴와 다르게 firebase Authentication에서 유저를 삭제하지는 않습니다.',
    },
    summary: '로그아웃 API',
    description:
      '# 로그아웃 API\n## Description\n로그아웃을 처리합니다. 해당 유저의 Refresh Token을 쿠키에서 탐색하여, 해당 token이 redis에 존재하는 refresh token과 같은지 검증합니다. RTR 방식으로 매번 refresh token을 생성하지만, 기존 브라우저에 존재하는 refresh token을 만료하게 할 수는 없기 떄문에, Redis와 같은 key-value 저장소에 저장된 토큰을 유효한 토큰으로 간주합니다.\n## Response\n반환값은 없습니다.\n## etc.\n⛳️ [로그아웃](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1418-10717&t=6UiMDM9wwxO4vDZo-4)   \n💬 참고자료: https://seungyong20.tistory.com/entry/JWT-Access-Token%EA%B3%BC-Refresh-Token-%EA%B7%B8%EB%A6%AC%EA%B3%A0-RTR-%EA%B8%B0%EB%B2%95%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90',
  })
  async signout(@User() user: UserWithRefreshTokenPayload, @Res() response: Response): Promise<ResponseEntity<string>> {
    await this.authService.signout(user);

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return ResponseEntity.OK_WITH_MESSAGE('User signed out');
  }
}
