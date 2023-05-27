import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { SigninGuard } from '../common/guards/signin.guard';
import { User } from '../common/decorators/request/user.decorator';
import { AuthService } from './auth.service';
import { UserPayload } from '../common/guards/signin-request-body.interface';
import { Response } from 'express';
import { TokenType } from '../../../enums/token.enum';
import { UserWithRefreshTokenPayload } from './types/jwt-tokwn.type';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';

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
  async signin(
    @Body() _: SigninRequestBodyDto,
    @User() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = await this.authService.signin(user);

    const accessToken = this.authService.issueAccessToken(userId);
    const refreshToken = this.authService.issueRefreshToken(userId);

    await this.authService.setRefreshToken(userId, refreshToken);

    const cookieOptions = this.authService.getCookieOptions(
      TokenType.RefreshToken,
    );

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
    description:
      '유효하지 않은 refresh token으로 access token 재발급에 실패했습니다.',
  })
  @ApiBadRequestResponse({ description: '유효하지 않은 요청입니다.' })
  async reissueAccessToken(
    @User() user: UserWithRefreshTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(user);

    const cookieOptions = this.authService.getCookieOptions(
      TokenType.RefreshToken,
    );

    response.cookie('refreshToken', refreshToken, cookieOptions);
    return { accessToken };
  }
}
