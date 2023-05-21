import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN } from '../consts/jwt.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  issueTestToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
