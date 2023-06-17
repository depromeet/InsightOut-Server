import { Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { AiService } from '🔥apps/server/ai/ai.service';
import { CreateAiKeywordsAndResumeBodyReqDto } from '🔥apps/server/ai/dto/req/createAiKeywordsAndResume.req.dto';
import {
  CreateAiKeywordsAndResumeBadRequestErrorResDto,
  CreateAiKeywordsAndResumeConfiltErrorResDto,
  CreateAiKeywordsAndResumeResDto,
} from '🔥apps/server/ai/dto/res/createAiKeywordsAndResume.res.dto';
import {
  createAiResumeAndCapabilitiesDescriptionMd,
  createAiResumeAndCapabilitiesSummaryMd,
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
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { RouteTable } from '🔥apps/server/common/decorators/router/route-table.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';

import { PromptKeywordResDto } from '🔥apps/server/ai/dto/res/promptKeyword.res.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';
import { PromptResumeResDto } from '🔥apps/server/ai/dto/res/promptResume.res.dto';
import { PromptSummaryBodyReqDto } from './dto/req/promptSummary.req.dto';
import { PromptSummaryResDto } from './dto/res/promptSummary.res.dto';
import { PromptAiKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptAiKeyword.req.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'ai',
  tag: {
    title: '🤖 AI API',
  },
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiConflictResponse({
    description: '⛔ 이미 해당 AI 자기소개서 및 키워드가 생성되었습니다.',
    type: CreateAiKeywordsAndResumeConfiltErrorResDto,
  })
  @ApiBadRequestResponse({
    description: '⛔ AI 생성하는 데 실패했습니다. 타입을 확인해주세요',
    type: CreateAiKeywordsAndResumeBadRequestErrorResDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateAiKeywordsAndResumeResDto,
    },
    description: createAiResumeAndCapabilitiesDescriptionMd,
    summary: createAiResumeAndCapabilitiesSummaryMd,
  })
  public async createAiResumeAndCapabilities(
    @Body() createAiKeywordsAndResumeBodyReqDto: CreateAiKeywordsAndResumeBodyReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<CreateAiKeywordsAndResumeResDto>> {
    const newAi = await this.aiService.create(createAiKeywordsAndResumeBodyReqDto, user);

    return ResponseEntity.CREATED_WITH_DATA(newAi);
  }

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
    const newAi = await this.aiService.postAiKeywordPrompt(promptKeywordBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

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
    const newAi = await this.aiService.postResumePrompt(promptKeywordBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

  @Route({
    request: {
      method: Method.POST,
      path: '/summary',
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
    @Body() promptSummaryBodyReqDto: PromptSummaryBodyReqDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PromptSummaryResDto>> {
    const newAi = await this.aiService.postSummaryPrompt(promptSummaryBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }
}
