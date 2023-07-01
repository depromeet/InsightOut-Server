import {
  postKeywordPromptDescriptionMd,
  postKeywordPromptSuccMd,
  postKeywordPromptSummaryMd,
  postResumePromptDescriptionMd,
  postResumePromptSuccMd,
  postResumePromptSummaryMd,
  postResumeSummarySuccMd,
  postResumeSummarySummaryMd,
  postSummaryPromptDescriptionMd,
} from '🔥apps/server/ai/markdown/ai.md';
import { BadRequestException, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { AiService } from '🔥apps/server/ai/ai.service';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-token.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { RouteTable } from '🔥apps/server/common/decorators/router/route-table.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { PromptKeywordResDto } from '🔥apps/server/ai/dto/res/promptKeyword.res.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';
import {
  PromptResumeBadRequestErrorDto,
  PromptResumeConflictErrorDto,
  PromptResumeNotFoundErrorDto,
  PromptResumeResDto,
} from '🔥apps/server/ai/dto/res/promptResume.res.dto';
import { PromptSummaryBodyReqDto } from './dto/req/promptSummary.req.dto';
import { PromptSummaryResDto } from './dto/res/promptSummary.res.dto';
import { PromptAiKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptAiKeyword.req.dto';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'ai',
  tag: {
    title: '🤖 AI API',
  },
})
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly redisCheckService: RedisCacheService,
    private readonly envService: EnvService,
  ) {}

  @ApiConflictResponse({
    description: '⛔ 해당 experienceId에 추천 AI Capability가 이미 존재합니다. :)',
    type: PromptResumeConflictErrorDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/keyword',
    },
    response: {
      code: HttpStatus.OK,
      type: PromptKeywordResDto,
      description: postKeywordPromptSuccMd,
    },
    description: postKeywordPromptDescriptionMd,
    summary: postKeywordPromptSummaryMd,
  })
  public async postAiKeywordPrompt(
    @Body() promptKeywordBodyReqDto: PromptAiKeywordBodyReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PromptKeywordResDto>> {
    await this.restricePrompt(user);
    const newAi = await this.aiService.postAiKeywordPrompt(promptKeywordBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

  @ApiBadRequestResponse({
    description: '⛔ AI 추천 자기소개서 타입을 확인해주세요 :)',
    type: PromptResumeBadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: '⛔ 역량 ID들 중 존재하지 않는 것이 있습니다. :)',
    type: PromptResumeNotFoundErrorDto,
  })
  @ApiConflictResponse({
    description: '⛔ 해당 experienceId에 추천 AI 자기소개서가 이미 존재합니다. :)',
    type: PromptResumeConflictErrorDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/resume',
    },
    response: {
      code: HttpStatus.OK,
      type: PromptResumeResDto,
      description: postResumePromptSuccMd,
    },
    description: postResumePromptDescriptionMd,
    summary: postResumePromptSummaryMd,
  })
  public async postResumePrompt(
    @Body() promptKeywordBodyReqDto: PromptResumeBodyResDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PromptResumeResDto>> {
    await this.restricePrompt(user);
    const newAi = await this.aiService.postResumePrompt(promptKeywordBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

  @Route({
    request: {
      method: Method.POST,
      path: '/experience-card',
    },
    response: {
      code: HttpStatus.OK,
      type: PromptSummaryResDto,
      description: postResumeSummarySuccMd,
    },
    description: postSummaryPromptDescriptionMd,
    summary: postResumeSummarySummaryMd,
  })
  public async postSummaryPrompt(
    @User() user: UserJwtToken,
    @Body() promptSummaryBodyReqDto: PromptSummaryBodyReqDto,
  ): Promise<ResponseEntity<PromptSummaryResDto>> {
    await this.restricePrompt(user);
    const newAi = await this.aiService.postSummaryPrompt(promptSummaryBodyReqDto);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

  public async restricePrompt(user: UserJwtToken) {
    const PROMPT_REDIS_KEY: string = this.envService.get(EnvEnum.PROMPT_REDIS_KEY);
    const promptCountStr = await this.redisCheckService.get(String(PROMPT_REDIS_KEY));
    let promptCountObj = JSON.parse(promptCountStr);

    if (promptCountObj === null) {
      // 없으면 최초로 유저 하나 추가해주기
      promptCountObj = {};
      promptCountObj[PROMPT_REDIS_KEY] = [{ userId: user.userId, count: 1 }];
      return await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj));
    } else {
      const userCount = promptCountObj[PROMPT_REDIS_KEY].find((item) => item.userId === user.userId);
      // 있으면 해당 유저 아이디 있는지 확인
      if (userCount) {
        if (userCount.count >= 50) {
          // 50회 이상이면 더 사용하지 못하게 하기
          throw new BadRequestException('50회 이상 사용하실 수 없습니다.');
        }
        // 50회 보다 작다면 count +1 하기
        promptCountObj[PROMPT_REDIS_KEY].forEach((item) => {
          if (item.userId === user.userId) item.count = item.count + 1;
        });
        return await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj));
      } else {
        // 없으면 해당 유저 처음이니 저장하기
        promptCountObj[PROMPT_REDIS_KEY].push({ userId: user.userId, count: 1 });
        return await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj));
      }
    }
  }
}
