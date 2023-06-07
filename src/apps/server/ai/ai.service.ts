import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { CreateAiKeywordsAndResumeBodyReqDto } from '🔥apps/server/ai/dto/req/createAiKeywordsAndResume.req.dto';
import { CreateAiKeywordsAndResumeResDto } from '🔥apps/server/ai/dto/res/createAiKeywordsAndResume.res.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
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
}
