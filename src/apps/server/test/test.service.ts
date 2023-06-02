import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN } from '../common/consts/jwt.const';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { PostIssueTestTokenRequestBodyDto } from '🔥apps/server/test/dtos/post-issue-test-token.dto';

@Injectable()
export class TestService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issueTestToken(body: PostIssueTestTokenRequestBodyDto) {
    const { userId } = body;
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
