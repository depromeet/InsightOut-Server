import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('signin')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '구글/애플/카카오 로그인',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 Token입니다.',
  })
  signIn(@Body() body: SigninRequestBodyDto) {
    console.log(body);
  }
}
