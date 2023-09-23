import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';

import { generateResumePrompt } from '@apps/server/ai/prompts/keywordPrompt';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@apps/server/common/consts/jwt.const';
import { PostAiResumeRequestDto } from '@apps/server/test/dtos/req/postAiResume.dto';
import { PostIssueTestTokenBodyRequestDto } from '@apps/server/test/dtos/req/postIssueTestToken.dto';
import { ApiService } from '@libs/modules/api/api.service';
import { RedisCacheService } from '@libs/modules/cache/redis/redis.service';
import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';
import { OpenAiService } from '@libs/modules/open-ai/openAi.service';

@Injectable()
export class TestService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly apiService: ApiService,
    private readonly openAiService: OpenAiService,
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

  public async postAiResume(postAiResumeDto: PostAiResumeRequestDto) {
    const { capabilities, ...body } = postAiResumeDto;
    const prompt = generateResumePrompt(body, capabilities);
    return this.openAiService.getStreamGPTResponse(prompt);
  }
}
