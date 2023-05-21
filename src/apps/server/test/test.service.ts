import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN } from '../consts/jwt.const';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../../../modules/cache/redis/redis.service';

@Injectable()
export class TestService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issueTestToken(userId: number) {
    const token = this.jwtService.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    await this.redisService.set(String(userId), token);
    return token;
  }
}
