import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  Capability,
  AiRecommendQuestion,
  AiResume,
  AiResumeCapability,
  Experience,
  ExperienceInfo,
  ExperienceStatus,
  Prisma,
  KeywordType,
} from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { UserJwtToken } from '🔥apps/server/auth/types/jwtToken.type';
import { OpenAiService } from '📚libs/modules/open-ai/openAi.service';
import {
  generateAiKeywordPrompt,
  generateRecommendQuestionsPrompt,
  generateResumePrompt,
  generateSummaryKeywordPrompt,
  generateSummaryPrompt,
} from '🔥apps/server/ai/prompts/keywordPrompt';
import { PromptKeywordResponseDto } from '🔥apps/server/ai/dto/res/promptKeyword.dto';
import { PromptResumeResponseDto } from '🔥apps/server/ai/dto/res/promptResume.dto';
import { PromptResumeBodyRequestDto } from '🔥apps/server/ai/dto/req/promptResume.dto';

import { ExperienceService } from '🔥apps/server/experiences/services/experience.service';
import { PromptAiKeywordRequestDto } from '🔥apps/server/ai/dto/req/promptAiKeyword.dto';
import { AiResponse } from '📚libs/modules/open-ai/interface/aiResponse.interface';
import { UpdateExperienceRequestDto } from '🔥apps/server/experiences/dto/req/updateExperience.dto';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { DAY } from '🔥apps/server/common/consts/time.const';
import { AiResumeRepository } from '📚libs/modules/database/repositories/aiResume.repository';
import { GetAiResumeQueryRequestDto } from '🔥apps/server/ai/dto/req/getAiResume.dto';
import { AiResumeResponseDto, GetAiResumeDto } from '🔥apps/server/ai/dto/res/getAiResume.dto';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { removeDuplicatesInArr } from '📚libs/utils/array.util';
import { GetExperienceCardInfoDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.dto';
import { PromptSummaryBodyRequestDto } from '🔥apps/server/ai/dto/req';
import { GetAiResumeCountResponseDto } from '🔥apps/server/ai/dto/res';

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

  public async postAiKeywordPrompt(body: PromptAiKeywordRequestDto, user: UserJwtToken): Promise<PromptKeywordResponseDto> {
    await this.validationExperinece(body.experienceId, user.userId);
    const aiCapability = await this.prisma.capability.findFirst({
      where: { experienceId: body.experienceId, keywordType: KeywordType.AI },
    });
    if (aiCapability) throw new ConflictException('이미 ai Capability가 존재합니다.');

    const prompt = generateAiKeywordPrompt(body);
    const aiKeywords = await this.openAiService.promptChatGPT(prompt);

    const parseAiKeywords = this.parsingPromptResult(aiKeywords).slice(0, 2);

    // capability생성
    const aiCapabilityInfos = parseAiKeywords.map((keyword) => {
      return {
        keyword: keyword.substring(0, 10),
        userId: user.userId,
        keywordType: KeywordType.AI,
        experienceId: body.experienceId,
      };
    });

    // 저장할 키워드 Info 정보 생성
    const aiCapabilities: Omit<Capability, 'userId' | 'keywordType' | 'experienceId'>[] = await this.prisma.$transaction(async (tx) => {
      return await Promise.all(
        aiCapabilityInfos.map(
          async (aiCapabilityInfo) => await tx.capability.create({ data: aiCapabilityInfo, select: { id: true, keyword: true } }),
        ),
      );
    });

    return new PromptKeywordResponseDto(aiCapabilities);
  }

  public async postResumePrompt(body: PromptResumeBodyRequestDto, user: UserJwtToken): Promise<PromptResumeResponseDto> {
    const experience = await this.validationExperinece(body.experienceId, user.userId);
    if (experience.AiResume) throw new BadRequestException('해당 experienceId에 추천 AI 자기소개서가 이미 존재합니다.');
    const aiCapabilities = await this.prisma.capability.findMany({
      where: { id: { in: body.capabilityIds }, keywordType: KeywordType.AI },
      select: { keyword: true },
    });
    if (aiCapabilities.length !== body.capabilityIds.length) throw new ConflictException('역량 ID들 중 존재하지 않는 것이 있습니다.');
    const keywords = aiCapabilities.map((aiCapability) => aiCapability.keyword);
    // -- 유효성 검사

    // resume prompt
    const CHOICES_IDX = 0;
    const prompt = generateResumePrompt(body, keywords);
    let result;

    try {
      result = await this.openAiService.promptChatGPT(prompt);
    } catch (error) {
      await this.processResumePrompt(user, '', body);

      return new PromptResumeResponseDto('추천된 Ai Resume가 없습니다.');
    }

    const resume = result.choices[CHOICES_IDX].message.content as string;
    await this.processResumePrompt(user, resume, body);

    return new PromptResumeResponseDto(result.choices[CHOICES_IDX].message.content as string);
  }

  private async processResumePrompt(user: UserJwtToken, resume: string, body: PromptResumeBodyRequestDto) {
    try {
      await this.prisma.$transaction(
        async (tx) => {
          // aiResume생성
          const newAiResume = await tx.aiResume.create({
            data: { userId: user.userId, content: resume.substring(0, 1000), experienceId: body.experienceId },
          });
          const aiResumeCapabilityInfos = body.capabilityIds.map((capabilityId) => {
            return { capabilityId, aiResumeId: newAiResume.id };
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
  }

  public async postSummaryPrompt(body: PromptSummaryBodyRequestDto, user: UserJwtToken): Promise<GetExperienceCardInfoDto> {
    const experience = await this.validationExperinece(body.experienceId, user.userId);
    try {
      if (experience.summaryKeywords.length !== 0) throw new ConflictException('이미 요약된 키워드가 있습니다.');
      if (experience.ExperienceInfo.analysis) throw new ConflictException('이미 요약된 정보가 있습니다.');
      if (experience.AiRecommendQuestions.length !== 0) throw new ConflictException('이미 추천된 자기소개서 항목이 있습니다.');

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
      const upsertExperienceReqDto = new UpdateExperienceRequestDto();
      upsertExperienceReqDto.analysis = (summary.choices[CHOICES_IDX].message.content as string).substring(0, 160);
      upsertExperienceReqDto.summaryKeywords = parseKeywords.map((keyword) => keyword.substring(0, 10));
      upsertExperienceReqDto.experienceStatus = ExperienceStatus.DONE;
      const updateInfo = upsertExperienceReqDto.compareProperty(experience);

      await this.experienceService.processUpdateExperience(body.experienceId, updateInfo);
      // analysis, keyword 업데이트 Done

      // 추천 Resume 저장 Start
      const recommendQuestions = await this.openAiService.promptChatGPT(aiRecommendResume);
      const parseRecommendQuestions: string[] = this.parseRecommendQuestion(recommendQuestions).slice(0, 2);
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
    } catch (error) {
      const upsertExperienceReqDto = new UpdateExperienceRequestDto();
      upsertExperienceReqDto.analysis = null;
      upsertExperienceReqDto.summaryKeywords = [];
      upsertExperienceReqDto.experienceStatus = ExperienceStatus.DONE;
      const updateInfo = upsertExperienceReqDto.compareProperty(experience);
      await this.experienceService.processUpdateExperience(body.experienceId, updateInfo);
      return await this.experienceService.getExperienceCardInfo(body.experienceId);
    }
  }

  public async getAiResumes(user: UserJwtToken, query?: GetAiResumeQueryRequestDto): Promise<GetAiResumeDto> {
    // aiResume 가져오기
    const aiResumeArr = await this.aiResumeRepository.getAiResumeByUserId(user.userId, query.aiKeyword);

    const aiResumeResDtoArr = aiResumeArr.map(
      (aiResume: AiResume & { AiResumeCapabilities: Partial<AiResumeCapability> & { Capability: Capability }[] }) => {
        return new AiResumeResponseDto(aiResume);
      },
    );

    // 내 aiResume 키워드 가져오기
    const aiResumeCapabilityArr = await this.capabilityRepository.findAiResumeCapabilities(user.userId);
    const availableKeywords = aiResumeCapabilityArr.map((capability) => capability.keyword);

    return new GetAiResumeDto(aiResumeResDtoArr, removeDuplicatesInArr<string>(availableKeywords));
  }

  public async getAiResumeCount(user: UserJwtToken, query?: GetAiResumeQueryRequestDto): Promise<GetAiResumeCountResponseDto> {
    const aiResumeCount = await this.aiResumeRepository.getAiResumeCount(user.userId, query.aiKeyword);

    return new GetAiResumeCountResponseDto(aiResumeCount);
  }

  // ---public done

  // private
  private async validationExperinece(
    experienceId: number,
    userId: number,
  ): Promise<
    Experience & {
      AiResume: AiResume;
      ExperienceInfo: ExperienceInfo;
      AiRecommendQuestions: AiRecommendQuestion[];
    }
  > {
    const experience = await this.experienceService.findOneById(experienceId, userId);
    if (!experience) throw new NotFoundException('해당 ID의 경험 카드를 찾을 수 없습니다.');
    return experience;
  }

  private parsingPromptResult(promptResult: AiResponse): string[] {
    try {
      return JSON.parse(promptResult.choices[0].message.content).keywords;
    } catch (error) {
      throw new InternalServerErrorException('키워드 생성에 실패했습니다.');
    }
  }

  private parseRecommendQuestion(aiResponse: AiResponse): string[] {
    try {
      return JSON.parse(aiResponse.choices[0].message.content).questions;
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
