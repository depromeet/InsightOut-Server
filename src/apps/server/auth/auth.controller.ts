import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { SigninGuard } from '../guards/signin.guard';
import { User } from '../decorators/request/user.decorator';
import { AuthService } from './auth.service';
import { UserPayload } from '../guards/signin-request-body.interface';
import { Response } from 'express';
import { TokenType } from '../../../enums/token.enum';

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
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = await this.authService.signin(user);

    const accessToken = this.authService.issueAccessToken(userId);
    const refreshToken = this.authService.issueRefreshToken(userId);

    await this.authService.setRefreshToken(userId, refreshToken);

    const cookieOptions = this.authService.getCookieOptions(
      TokenType.RefreshToken,
    );

    res.cookie('refreshToken', refreshToken, cookieOptions);
    return { accessToken };
  }
}
