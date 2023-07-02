import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiResume, Prisma } from '@prisma/client';
import { AiResumeRepositoryInterface } from '🔥apps/server/ai/interface/ai-repository.interface';

@Injectable()
export class AiResumeRepository implements AiResumeRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneByFilter(where: Prisma.AiResumeWhereInput): Promise<AiResume> {
    return await this.prisma.aiResume.findFirst({ where });
  }
}
