import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { ApiService } from '📚libs/modules/api/api.service';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { EnvService } from '📚libs/modules/env/env.service';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '🔥apps/server/common/consts/jwt.const';
import { PostIssueTestTokenBodyRequestDto } from '🔥apps/server/test/dtos/req/postIssueTestToken.dto';

@Injectable()
export class TestService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly apiService: ApiService,
  ) {}

  async issueTestToken(body: PostIssueTestTokenBodyRequestDto) {
    const { userId } = body;
    const accessToken = this.jwtService.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
        secret: this.envService.get<string>(EnvEnum.JWT_ACCESS_TOKEN_SECRET),
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN * 1000,
        secret: this.envService.get<string>(EnvEnum.JWT_REFRESH_TOKEN_SECRET),
      },
    );
    await this.redisService.set(String(userId), refreshToken);
    return { accessToken, refreshToken };
  }

  getRefreshTokenCookieOptions(): CookieOptions {
    const cookieOptions: CookieOptions =
      this.envService.get<string>(EnvEnum.NODE_ENV) === 'main'
        ? {
            secure: true,
            sameSite: 'none',
          }
        : {
            secure: false,
            sameSite: 'lax',
          };

    return cookieOptions;
  }

  getRandomNickname(): string {
    const randomNickName = this.apiService.getRandomNickname();

    return randomNickName;
  }
}
