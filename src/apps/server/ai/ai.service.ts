import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { ExperienceService } from '🔥apps/server/experiences/services/experience.service';
import { PromptAiKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptAiKeyword.req.dto';
import { AiResponse } from '📚libs/modules/open-ai/interface/aiResponse.interface';
import { UpdateExperienceReqDto } from '🔥apps/server/experiences/dto/req/updateExperience.dto';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { DAY } from '🔥apps/server/common/consts/time.const';
import { AiResumeRepository } from '📚libs/modules/database/repositories/ai-resume.repository';
import { GetAiResumeQueryReqDto } from '🔥apps/server/ai/dto/req/getAiResume.req.dto';
import { AiResumeDto, GetAiResumeResDto } from '🔥apps/server/ai/dto/res/getAiResume.res.dto';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { removeDuplicatesInArr } from '📚libs/utils/array.util';
import { GetAiResumeCountResDto } from '🔥apps/server/ai/dto/res/getAiResumeCount.res.dto';
import { GetExperienceCardInfoResDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.res.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
    private readonly experienceService: ExperienceService,
    private readonly redisCheckService: RedisCacheService,
    private readonly envService: EnvService,
    private readonly aiResumeRepository: AiResumeRepository,
    private readonly capabilityRepository: CapabilityRepository,
  ) {}

  public async postAiKeywordPrompt(body: PromptAiKeywordBodyReqDto, user: UserJwtToken): Promise<PromptKeywordResDto> {
    await this.validationExperinece(body.experienceId, user.userId);
    const aiCapability = await this.prisma.aiResume.findUnique({
      where: { experienceId: body.experienceId },
      select: { AiResumeCapability: true },
    });
    if (aiCapability) throw new ConflictException('이미 ai Capability가 존재합니다.');

    const prompt = generateAiKeywordPrompt(body);
    const aiKeywords = await this.openAiService.promptChatGPT(prompt);

    const parseAiKeywords = this.parsingPromptResult(aiKeywords).slice(0, 2);

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
    const experience = await this.validationExperinece(body.experienceId, user.userId);
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
      await this.prisma.$transaction(
        async (tx) => {
          // aiResume생성
          const newAiResume = await tx.aiResume.create({
            data: { userId: user.userId, content: resume, experienceId: body.experienceId },
          });
          const aiResumeCapabilityInfos = body.capabilityIds.map((capabilityId) => {
            return { capabilityId: capabilityId, aiResumeId: newAiResume.id };
          });
          // aiResumeCapability 생성
          await tx.aiResumeCapability.createMany({ data: aiResumeCapabilityInfos });
        },
        { timeout: 10000 },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('AI 추천 자기소개서 타입을 확인해주세요');
      }
      throw error;
    }

    return new PromptResumeResDto(result.choices[CHOICES_IDX].message.content as string);
  }

  public async postSummaryPrompt(body: PromptSummaryBodyReqDto, user: UserJwtToken): Promise<GetExperienceCardInfoResDto> {
    const experience = await this.validationExperinece(body.experienceId, user.userId);
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

    const parseKeywords = this.parsingPromptResult(keywords).slice(0, 2);
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
    const parseRecommendQuestions: string[] = this.parsingPromptResult(recommendQuestions).slice(0, 2);
    const aiRecommendInfos = parseRecommendQuestions.map((question) => {
      return {
        experienceId: body.experienceId,
        title: question,
      };
    });
    await this.prisma.aiRecommendQuestion.createMany({ data: aiRecommendInfos });
    // 추천 Resume 저장 Done

    // 생성된 경험 분해 키드에 들어갈 데이터 return
    return await this.experienceService.getExperienceCardInfo(body.experienceId);
  }

  public async getAiResumes(user: UserJwtToken, query?: GetAiResumeQueryReqDto): Promise<GetAiResumeResDto> {
    // aiResume 가져오기
    const aiResumeArr = await this.aiResumeRepository.getAiResumeByUserId(user.userId, query.aiKeyword);

    const aiResumeResDtoArr = aiResumeArr.map(
      (aiResume: { AiResumeCapability: { Capability: { keyword: string } }[]; id: number; updatedAt: Date; content: string }) => {
        return new AiResumeDto(aiResume);
      },
    );

    // 내 aiResume 키워드 가져오기
    const aiResumeCapabilityArr = await this.capabilityRepository.findAiResumeCapabilities(user.userId);
    const availableKeywords = aiResumeCapabilityArr.map((capability) => capability.keyword);

    return new GetAiResumeResDto(aiResumeResDtoArr, removeDuplicatesInArr<string>(availableKeywords));
  }

  public async getAiResumeCount(user: UserJwtToken, query?: GetAiResumeQueryReqDto): Promise<GetAiResumeCountResDto> {
    const aiResumeCount = await this.aiResumeRepository.getAiResumeCount(user.userId, query.aiKeyword);

    return new GetAiResumeCountResDto(aiResumeCount);
  }

  // ---public done

  // private
  private async validationExperinece(
    experienceId: number,
    userId: number,
  ): Promise<Experience & { AiResume; ExperienceInfo; AiRecommendQuestion }> {
    const experience = await this.experienceService.findOneById(experienceId, userId);
    if (!experience) throw new NotFoundException('해당 ID의 경험 카드를 찾을 수 없습니다.');
    return experience;
  }

  private parsingPromptResult(promptResult: AiResponse): string[] {
    const CHOICES_IDX = 0;

    try {
      if (typeof promptResult.choices[CHOICES_IDX].message.content === 'string') {
        return (
          JSON.parse(promptResult.choices[CHOICES_IDX].message.content).keywords ??
          JSON.parse(promptResult.choices[CHOICES_IDX].message.content)
        );
      } else {
        return promptResult.choices[CHOICES_IDX].message.content as string[];
      }
    } catch (error) {
      throw new InternalServerErrorException('키워드 생성에 실패했습니다.');
    }
  }

  public async restrictPrompt(user: UserJwtToken): Promise<void> {
    const PROMPT_REDIS_KEY: string = this.envService.get(EnvEnum.PROMPT_REDIS_KEY);
    const promptCountStr = await this.redisCheckService.get(String(PROMPT_REDIS_KEY));
    let promptCountObj = JSON.parse(promptCountStr);

    if (promptCountObj === null) {
      // 없으면 최초로 유저 하나 추가해주기
      promptCountObj = {};
      promptCountObj[PROMPT_REDIS_KEY] = [{ userId: user.userId, count: 1 }];
      await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj), DAY);
    } else {
      const foundUserIdx = promptCountObj[PROMPT_REDIS_KEY].findIndex((item) => item.userId === user.userId);

      // 있으면 해당 유저 아이디 있는지 확인
      if (foundUserIdx !== -1) {
        if (promptCountObj[PROMPT_REDIS_KEY][foundUserIdx].count >= 50) {
          // 50회 이상이면 더 사용하지 못하게 하기
          throw new BadRequestException('50회 이상 사용하실 수 없습니다.');
        }
        // 50회 보다 작다면 count +1 하기
        promptCountObj[PROMPT_REDIS_KEY][foundUserIdx].count += 1;
        await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj), DAY);
      } else {
        // 없으면 해당 유저 처음이니 저장하기
        promptCountObj[PROMPT_REDIS_KEY].push({ userId: user.userId, count: 1 });
        await this.redisCheckService.set(String(PROMPT_REDIS_KEY), JSON.stringify(promptCountObj), DAY);
      }
    }
  }
}
