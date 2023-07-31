import {
  getAiResumeCountDescriptionMd,
  getAiResumeCountSuccMd,
  getAiResumeCountSummaryMd,
  getAiResumeDescriptionMd,
  getAiResumeSuccMd,
  getAiResumeSummaryMd,
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
import {
  GetAiResumeQueryReqDto,
  PromptAiKeywordBodyReqDto,
  PromptResumeBodyResDto,
  PromptSummaryBodyReqDto,
} from '🔥apps/server/ai/dto/req';
import {
  GetAiResumeCountResDto,
  GetAiResumeResDto,
  PromptKeywordResDto,
  PromptResumeBadRequestErrorDto,
  PromptResumeConflictErrorDto,
  PromptResumeKeywordsConflictErrorDto,
  PromptResumeNotFoundErrorDto,
  PromptResumeResDto,
} from '🔥apps/server/ai/dto/res';
import { Body, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { AiService } from '🔥apps/server/ai/ai.service';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-token.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { RouteTable } from '🔥apps/server/common/decorators/router/route-table.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { GetExperienceCardInfoResDto } from '🔥apps/server/experiences/dto';

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
      type: GetAiResumeResDto,
      description: getAiResumeSuccMd,
    },
    description: getAiResumeDescriptionMd,
    summary: getAiResumeSummaryMd,
  })
  public async getAiResume(
    @User() user: UserJwtToken,
    @Query() getAiResumeQueryReqDto?: GetAiResumeQueryReqDto,
  ): Promise<ResponseEntity<GetAiResumeResDto>> {
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
      type: GetAiResumeCountResDto,
      description: getAiResumeCountSuccMd,
    },
    description: getAiResumeCountDescriptionMd,
    summary: getAiResumeCountSummaryMd,
  })
  public async getAiResumeCount(
    @User() user: UserJwtToken,
    @Query() getAiResumeQueryReqDto?: GetAiResumeQueryReqDto,
  ): Promise<ResponseEntity<GetAiResumeCountResDto>> {
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
      type: GetExperienceCardInfoResDto,
      description: postResumeSummarySuccMd,
    },
    description: postSummaryPromptDescriptionMd,
    summary: postResumeSummarySummaryMd,
  })
  public async postSummaryPrompt(
    @User() user: UserJwtToken,
    @Body() promptSummaryBodyReqDto: PromptSummaryBodyReqDto,
  ): Promise<ResponseEntity<GetExperienceCardInfoResDto>> {
    await this.aiService.restrictPrompt(user);
    const newAi = await this.aiService.postSummaryPrompt(promptSummaryBodyReqDto, user);

    return ResponseEntity.OK_WITH_DATA(newAi);
  }

  @Route({
    request: {
      method: 'POST',
      path: 'ai-resume',
    },
    response: {
      code: HttpStatus.OK,
      description: 'AI 자기소개서 추천을 stream 방식으로 응답을 전송합니다.',
    },
    summary: 'AI 자기소개서 stream test',
  })
  public async postAiResume(@Body() postAiResumeRequestDto: PostAiResumeRequestDto) {
    return await this.aiService.postAiResume(postAiResumeRequestDto);
  }
}
