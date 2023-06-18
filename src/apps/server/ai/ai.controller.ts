import { Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { AiService } from '🔥apps/server/ai/ai.service';
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
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
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
  public async postSummaryPrompt(@Body() promptSummaryBodyReqDto: PromptSummaryBodyReqDto): Promise<ResponseEntity<PromptSummaryResDto>> {
    const newAi = await this.aiService.postSummaryPrompt(promptSummaryBodyReqDto);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }
}
