import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, KeywordType, Capability } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { CreateAiKeywordsAndResumeResDto } from '🔥apps/server/ai/dto/res/createAiKeywordsAndResume.res.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { CreateAiKeywordsAndResumeBodyReqDto } from '🔥apps/server/ai/dto/req/createAiKeywordsAndResume.req.dto';
import { PromptKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptKeyword.req.dto';
import { OpenAiService } from '📚libs/modules/open-ai/open-ai.service';
import { generateAiKeywordPrompt, generateResumePrompt, generateSummaryPrompt } from '🔥apps/server/ai/prompt/keywordPrompt';
import { PromptKeywordResDto } from '🔥apps/server/ai/dto/res/promptKeyword.res.dto';
import { PromptResumeResDto } from '🔥apps/server/ai/dto/res/promptResume.res.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';
import { PromptSummaryBodyReqDto } from './dto/req/promptSummary.req.dto';
import { PromptSummaryResDto } from './dto/res/promptSummary.res.dto';
import { ExperienceService } from '🔥apps/server/experiences/services/experience.service';
import { UpsertExperienceReqDto } from '🔥apps/server/experiences/dto/req/upsertExperience.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
    private readonly experienceService: ExperienceService,
  ) {}
  public async create(body: CreateAiKeywordsAndResumeBodyReqDto, user: UserJwtToken): Promise<CreateAiKeywordsAndResumeResDto> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // aiResume 생성
        const newAiResume = await tx.aiResume.create({
          data: { userId: user.userId, content: body.content, experienceId: body.experienceId },
        });

        const capabilityInfos = body.keywords.map((keyword) => {
          return { userId: user.userId, keyword, keywordType: KeywordType.AI };
        });

        // capability를 map으로 생성 -> 최대 2개이기 때문에 가능
        const capabilityids: { id: number }[] = await Promise.all(
          capabilityInfos.map(async (capabilityInfo) => await tx.capability.create({ data: capabilityInfo, select: { id: true } })),
        );
        const aiResumeCapabilityInfos = capabilityids.map((capabilityId) => {
          return { capabilityId: capabilityId.id, aiResumeId: newAiResume.id };
        });

        // aiResumeCapability 생성
        await tx.aiResumeCapability.createMany({ data: aiResumeCapabilityInfos });
        const result = { resume: newAiResume.content, keywords: body.keywords };

        return new CreateAiKeywordsAndResumeResDto(result);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new ConflictException('이미 해당 AI 추천 자기소개서가 존재합니다.');
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('AI 생성하는 데 실패했습니다. 타입을 확인해주세요');
      }
    }
  }

  public async postAiKeywordPrompt(body: PromptKeywordBodyReqDto, user: UserJwtToken): Promise<PromptKeywordResDto> {
    const experience = await this.experienceService.findOneById(body.experienceId);
    if (!experience) throw new NotFoundException('해당 ID의 경험 카드를 찾을 수 없습니다.');
    const CHOICES_IDX = 0;
    const prompt = generateAiKeywordPrompt(body);
    const result = await this.openAiService.promptChatGPT(prompt);

    let keywords;
    if (typeof result.choices[CHOICES_IDX].message.content === 'string') {
      keywords = JSON.parse(result.choices[CHOICES_IDX].message.content);
    }

    // capability생성
    const capabilityInfos = keywords.map((keyword) => {
      return {
        keywordType: KeywordType.AI,
        keyword,
        userId: user.userId,
      };
    });
    const capabilities: Capability[] = await Promise.all(
      capabilityInfos.map(
        async (capabilityInfo) => await this.prisma.capability.create({ data: capabilityInfo, select: { id: true, keyword: true } }),
      ),
    );

    return new PromptKeywordResDto(capabilities);
  }

  public async postResumePrompt(body: PromptResumeBodyResDto): Promise<PromptResumeResDto> {
    const CHOICES_IDX = 0;
    const prompt = generateResumePrompt(body);
    const result = await this.openAiService.promptChatGPT(prompt);

    return new PromptResumeResDto(result.choices[CHOICES_IDX].message.content as string);
  }

  public async postSummaryPrompt(body: PromptSummaryBodyReqDto, user: UserJwtToken) {
    const CHOICES_IDX = 0;
    const summaryPrompt = generateSummaryPrompt(body);
    // const keywordPrompt = generateKeywordPrompt(body);

    const [summary] = await Promise.all([
      this.openAiService.promptChatGPT(summaryPrompt),
      // this.openAiService.promptChatGPT(keywordPrompt),
    ]);

    // analysis 업데이트
    const upsertExperienceReqDto = new UpsertExperienceReqDto();
    upsertExperienceReqDto.analysis = summary.choices[CHOICES_IDX].message.content as string;

    await this.experienceService.upsertExperience(upsertExperienceReqDto, user);

    // find로 내려주기

    return new PromptSummaryResDto(summary.choices[CHOICES_IDX].message.content as string);
  }
}
