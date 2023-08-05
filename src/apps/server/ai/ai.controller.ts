import { Body, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { AiService } from '@apps/server/ai/ai.service';
import * as AiDocs from '@apps/server/ai/docs/ai.md';
import {
  GetAiResumeQueryRequestDto,
  PromptAiKeywordRequestDto,
  PromptResumeBodyRequestDto,
  PromptSummaryBodyRequestDto,
} from '@apps/server/ai/dto/req';
import {
  GetAiResumeCountResponseDto,
  GetAiResumeDto,
  PromptKeywordResponseDto,
  PromptResumeBadRequestErrorDto,
  PromptResumeConflictErrorDto,
  PromptResumeKeywordsConflictErrorDto,
  PromptResumeNotFoundErrorDto,
  PromptResumeResponseDto,
} from '@apps/server/ai/dto/res';
import { UserJwtToken } from '@apps/server/auth/types/jwtToken.type';
import { User } from '@apps/server/common/decorators/req/user.decorator';
import { Route } from '@apps/server/common/decorators/routers/route.decorator';
import { RouteTable } from '@apps/server/common/decorators/routers/routeTable.decorator';
import { JwtAuthGuard } from '@apps/server/common/guards/jwtAuth.guard';
import { GetExperienceCardInfoDto } from '@apps/server/experiences/dto';
import { Method } from '@libs/enums/method.enum';
import { ResponseEntity } from '@libs/utils/respone.entity';

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

  @Route({
    request: {
      method: Method.GET,
      path: '/ai-resume',
    },
    response: {
      code: HttpStatus.OK,
      type: GetAiResumeDto,
      description: AiDocs.getAiResumeSuccessMd,
    },
    description: AiDocs.getAiResumeDescriptionMd,
    summary: AiDocs.getAiResumeSummaryMd,
  })
  public async getAiResume(
    @User() user: UserJwtToken,
    @Query() getAiResumeQueryReqDto?: GetAiResumeQueryRequestDto,
  ): Promise<ResponseEntity<GetAiResumeDto>> {
    const aiResumes = await this.aiService.getAiResumes(user, getAiResumeQueryReqDto);

    return ResponseEntity.OK_WITH_DATA(aiResumes);
  }

  @Route({
    request: {
      method: Method.GET,
      path: '/ai-resume/count',
    },
    response: {
      code: HttpStatus.OK,
      type: GetAiResumeCountResponseDto,
      description: AiDocs.getAiResumeCountSuccessMd,
    },
    description: AiDocs.getAiResumeCountDescriptionMd,
    summary: AiDocs.getAiResumeCountSummaryMd,
  })
  public async getAiResumeCount(
    @User() user: UserJwtToken,
    @Query() getAiResumeQueryReqDto?: GetAiResumeQueryRequestDto,
  ): Promise<ResponseEntity<GetAiResumeCountResponseDto>> {
    const aiResumes = await this.aiService.getAiResumeCount(user, getAiResumeQueryReqDto);

    return ResponseEntity.OK_WITH_DATA(aiResumes);
  }

  @ApiConflictResponse({
    description: '⛔ 해당 experienceId에 추천 AI Capability가 이미 존재합니다. :)',
    type: PromptResumeKeywordsConflictErrorDto,
  })
  @Route({
    request: {
      method: Method.POST,
      path: '/keyword',
    },
    response: {
      code: HttpStatus.OK,
      type: PromptKeywordResponseDto,
      description: AiDocs.postKeywordPromptSuccessMd,
    },
    description: AiDocs.postKeywordPromptDescriptionMd,
    summary: AiDocs.postKeywordPromptSummaryMd,
  })
  public async postAiKeywordPrompt(
    @Body() promptKeywordBodyReqDto: PromptAiKeywordRequestDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PromptKeywordResponseDto>> {
    await this.aiService.restrictPrompt(user);
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
      type: PromptResumeResponseDto,
      description: AiDocs.postResumePromptSuccessMd,
    },
    description: AiDocs.postResumePromptDescriptionMd,
    summary: AiDocs.postResumePromptSummaryMd,
  })
  public async postResumePrompt(
    @Body() promptKeywordBodyReqDto: PromptResumeBodyRequestDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PromptResumeResponseDto>> {
    await this.aiService.restrictPrompt(user);
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
      type: GetExperienceCardInfoDto,
      description: AiDocs.postResumeSummarySuccessMd,
    },
    description: AiDocs.postSummaryPromptDescriptionMd,
    summary: AiDocs.postResumeSummarySummaryMd,
  })
  public async postSummaryPrompt(
    @User() user: UserJwtToken,
    @Body() promptSummaryBodyReqDto: PromptSummaryBodyRequestDto,
  ): Promise<ResponseEntity<GetExperienceCardInfoDto>> {
    await this.aiService.restrictPrompt(user);
    const newAi = await this.aiService.postSummaryPrompt(promptSummaryBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }
}
