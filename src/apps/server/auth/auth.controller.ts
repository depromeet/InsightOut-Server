import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { SigninGuard } from '../guards/signin.guard';
import { User } from '../decorators/request/user.decorator';
import { TokenPayload } from 'google-auth-library';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
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
  signIn(@Body() body: SigninRequestBodyDto, @User() user: TokenPayload) {
    console.log(body);
    console.log(user);
  }
}
