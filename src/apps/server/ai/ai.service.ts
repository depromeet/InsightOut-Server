import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Capability, Experience, KeywordType, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-token.type';
import { OpenAiService } from '📚libs/modules/open-ai/open-ai.service';
import {
  generateAiKeywordPrompt,
  generateRecommendQuestionsPrompt,
  generateResumePrompt,
  generateSummaryKeywordPrompt,
  generateSummaryPrompt,
} from '🔥apps/server/ai/prompt/keywordPrompt';
import { PromptKeywordResDto } from '🔥apps/server/ai/dto/res/promptKeyword.res.dto';
import { PromptResumeResDto } from '🔥apps/server/ai/dto/res/promptResume.res.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';
import { PromptSummaryBodyReqDto } from './dto/req/promptSummary.req.dto';
import { PromptSummaryResDto } from './dto/res/promptSummary.res.dto';
import { ExperienceService } from '🔥apps/server/experiences/services/experience.service';

import { PromptAiKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptAiKeyword.req.dto';
import { OpenAiResponseInterface } from '📚libs/modules/open-ai/interface/openAiResponse.interface';
import { UpdateExperienceReqDto } from '🔥apps/server/experiences/dto/req/updateExperience.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
    private readonly experienceService: ExperienceService,
  ) {}

  public async postAiKeywordPrompt(body: PromptAiKeywordBodyReqDto, user: UserJwtToken): Promise<PromptKeywordResDto> {
    await this.validationExperinece(body.experienceId);
    const aiCapability = await this.prisma.aiResume.findUnique({
      where: { experienceId: body.experienceId },
      select: { AiResumeCapability: true },
    });
    if (aiCapability) throw new ConflictException('이미 ai Capability가 존재합니다.');

    const prompt = generateAiKeywordPrompt(body);
    const aiKeywords = await this.openAiService.promptChatGPT(prompt);

    const parseAiKeywords = this.parsingPromptResult(aiKeywords);

    // capability생성
    const capabilityInfos = parseAiKeywords.map((keyword) => {
      return {
        keyword,
        userId: user.userId,
        keywordType: KeywordType.AI,
      };
    });

    // 저장할 키워드 Info 정보 생성
    const capabilities: Omit<Capability, 'userId' | 'keywordType'>[] = await this.prisma.$transaction(async (tx) => {
      return await Promise.all(
        capabilityInfos.map(
          async (capabilityInfo) => await tx.capability.create({ data: capabilityInfo, select: { id: true, keyword: true } }),
        ),
      );
    });

    return new PromptKeywordResDto(capabilities);
  }

  public async postResumePrompt(body: PromptResumeBodyResDto, user: UserJwtToken): Promise<PromptResumeResDto> {
    const experience = await this.validationExperinece(body.experienceId);
    if (experience.AiResume) throw new BadRequestException('해당 experienceId에 추천 AI 자기소개서가 이미 존재합니다.');
    const capabilities = await this.prisma.capability.findMany({ where: { id: { in: body.capabilityIds } }, select: { keyword: true } });
    if (capabilities.length !== body.capabilityIds.length) throw new ConflictException('역량 ID들 중 존재하지 않는 것이 있습니다.');
    const keywords = capabilities.map((capability) => capability.keyword);
    // -- 유효성 검사

    // resume prompt
    const CHOICES_IDX = 0;
    const prompt = generateResumePrompt(body, keywords);
    const result = await this.openAiService.promptChatGPT(prompt);
    const resume = result.choices[CHOICES_IDX].message.content as string;

    try {
      await this.prisma.$transaction(async (tx) => {
        // aiResume생성
        const newAiResume = await tx.aiResume.create({
          data: { userId: user.userId, content: resume, experienceId: body.experienceId },
        });
        const aiResumeCapabilityInfos = body.capabilityIds.map((capabilityId) => {
          return { capabilityId: capabilityId, aiResumeId: newAiResume.id };
        });
        // aiResumeCapability 생성
        await tx.aiResumeCapability.createMany({ data: aiResumeCapabilityInfos });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('AI 추천 자기소개서 타입을 확인해주세요');
      }
    }

    return new PromptResumeResDto(result.choices[CHOICES_IDX].message.content as string);
  }

  public async postSummaryPrompt(body: PromptSummaryBodyReqDto): Promise<PromptSummaryResDto> {
    const experience = await this.validationExperinece(body.experienceId);
    if (experience.summaryKeywords.length !== 0) throw new ConflictException('이미 요약된 키워드가 있습니다.');
    if (experience.ExperienceInfo.analysis) throw new ConflictException('이미 요약된 정보가 있습니다.');
    if (experience.AiRecommendQuestion.length !== 0) throw new ConflictException('이미 추천된 자기소개서 항목이 있습니다.');

    const CHOICES_IDX = 0;
    const summaryPrompt = generateSummaryPrompt(body);
    const aiSummaryKeywords = generateSummaryKeywordPrompt(body);

    const [summary, keywords] = await Promise.all([
      this.openAiService.promptChatGPT(summaryPrompt),
      this.openAiService.promptChatGPT(aiSummaryKeywords),
    ]);

    const parseKeywords = this.parsingPromptResult(keywords);
    const aiRecommendResume = generateRecommendQuestionsPrompt(parseKeywords);

    // analysis, keyword 업데이트
    const upsertExperienceReqDto = new UpdateExperienceReqDto();
    upsertExperienceReqDto.analysis = summary.choices[CHOICES_IDX].message.content as string;
    upsertExperienceReqDto.summaryKeywords = parseKeywords;
    const updateInfo = upsertExperienceReqDto.compareProperty(experience);

    await this.experienceService.processUpdateExperience(body.experienceId, updateInfo);
    // analysis, keyword 업데이트 Done

    // 추천 Resume 저장 Start
    const recommendQuestions = await this.openAiService.promptChatGPT(aiRecommendResume);
    const parseRecommendQuestions: string[] = this.parsingPromptResult(recommendQuestions);
    const aiRecommendInfos = parseRecommendQuestions.map((question) => {
      return {
        experienceId: body.experienceId,
        title: question,
      };
    });
    await this.prisma.aiRecommendQuestion.createMany({ data: aiRecommendInfos });
    // 추천 Resume 저장 Done

    // 생성된 경험 분해 키드에 들어갈 데이터 return
    return new PromptSummaryResDto(await this.experienceService.getExperienceCardInfo(body.experienceId));
  }
  // ---public done

  // private
  private async validationExperinece(experienceId: number): Promise<Experience & { AiResume; ExperienceInfo; AiRecommendQuestion }> {
    const experience = await this.experienceService.findOneById(experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 경험 카드를 찾을 수 없습니다.');
    return experience;
  }

  private parsingPromptResult(promptResult: OpenAiResponseInterface): string[] {
    const CHOICES_IDX = 0;

    if (typeof promptResult.choices[CHOICES_IDX].message.content === 'string') {
      return JSON.parse(promptResult.choices[CHOICES_IDX].message.content);
    } else {
      return promptResult.choices[CHOICES_IDX].message.content as string[];
    }
  }
}
