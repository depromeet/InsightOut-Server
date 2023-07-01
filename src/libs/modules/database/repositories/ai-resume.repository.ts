import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiResumeRepositoryInterface } from '🔥apps/server/ai/interface/ai-repository.interface';

class AiResumeFindManyArgs {}

@Injectable()
export class AiResumeRepository implements AiResumeRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async getAiResumeByUserId(userId: number, aiKeyword?: string) {
    let where = <AiResumeFindManyArgs>{ userId };

    if (aiKeyword) {
      where = { userId, AiResumeCapability: { some: { Capability: { keyword: { equals: aiKeyword } } } } };
    }

    return await this.prisma.aiResume.findMany({
      select: { id: true, content: true, updatedAt: true, AiResumeCapability: { select: { Capability: { select: { keyword: true } } } } },
      where,
    });
  }
}
