import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';

import { CreateAiKeywordsAndResumeResDto } from '🔥apps/server/ai/dto/res/createAiKeywordsAndResume.res.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { CreateAiKeywordsAndResumeBodyReqDto } from '🔥apps/server/ai/dto/req/createAiKeywordsAndResume.req.dto';
import { PromptKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptKeyword.req.dto';
import { OpenAiService } from '📚libs/modules/open-ai/open-ai.service';
import { generateKeywordPrompt, generateResumePrompt } from '🔥apps/server/ai/prompt/keywordPrompt';
import { PromptKeywordResDto } from '🔥apps/server/ai/dto/res/promptKeyword.res.dto';
import { PromptResumeBodyResDto } from '\uD83D\uDD25apps/server/ai/dto/req/promptResume.req.dto';
import { PromptResumeResDto } from '🔥apps/server/ai/dto/res/promptResume.res.dto';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService, private readonly openAiService: OpenAiService) {}
  public async create(body: CreateAiKeywordsAndResumeBodyReqDto, user: UserJwtToken): Promise<CreateAiKeywordsAndResumeResDto> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // aiResume생성
        const newAiResume = await tx.aiResume.create({
          data: { userId: user.userId, content: body.content, experienceId: body.experienceId },
        });

        const capabilityInfos = body.keywords.map((keyword) => {
          return { userId: user.userId, aiResumeId: newAiResume.id, keyword };
        });
        // aiCapability생성
        const newAiCapability = await tx.aiCapability.createMany({ data: capabilityInfos });
        const result = { content: newAiResume.content, aiCapabilityCreatedCount: newAiCapability.count, keywords: body.keywords };

        return new CreateAiKeywordsAndResumeResDto(result);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new ConflictException('이미 해당 AI 추천 자기소개서가 존재합니다.');
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('AI 생성하는 데 실패했습니다. 타입을 확인해주세요');
      }
    }
  }

  public async postKeywordPrompt(body: PromptKeywordBodyReqDto): Promise<PromptKeywordResDto> {
    const CHOICES_IDX = 0;
    const prompt = generateKeywordPrompt(body);
    const result = await this.openAiService.promptChatGPT(prompt);

    if (typeof result.choices[CHOICES_IDX].message.content === 'string') {
      return new PromptKeywordResDto(JSON.parse(result.choices[CHOICES_IDX].message.content));
    }

    return new PromptKeywordResDto(result.choices[CHOICES_IDX].message.content);
  }

  public async postResumePrompt(body: PromptResumeBodyResDto): Promise<PromptResumeResDto> {
    const CHOICES_IDX = 0;
    const prompt = generateResumePrompt(body);
    const result = await this.openAiService.promptChatGPT(prompt);

    return new PromptResumeResDto(result.choices[CHOICES_IDX].message.content as string);
  }
}
