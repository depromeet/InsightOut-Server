import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
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
import { ResponseEntity } from '📚libs/utils/respone.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SigninGuard)
  @Post('signin')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '구글/애플/카카오 로그인',
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
  async withdraw(@User() user: UserWithRefreshTokenPayload) {
    await this.authService.withdraw(user);

    return ResponseEntity.OK_WITH_MESSAGE('User withdrawed');
  }
}
