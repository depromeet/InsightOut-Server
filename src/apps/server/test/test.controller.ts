import { Body, Controller, Post, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { Response } from 'express';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { ACCESS_TOKEN_EXPIRES_IN } from '../common/consts/jwt.const';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('token')
  async issueTestToken(@Body() { userId }: { userId: number }, @Res({ passthrough: true }) response: Response) {
    const jwtToken = await this.testService.issueTestToken(userId);

    response.cookie('refreshToken', jwtToken, {
      maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
      httpOnly: true,
    });
    return ResponseEntity.CREATED_WITH_DATA(jwtToken);
  }
}
