import { Injectable } from '@nestjs/common';
import { AiResume, Prisma } from '@prisma/client';

import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume/aiResume.interface';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class AiResumeRepositoryImpl implements AiResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneByUserIdAndExperienceId(userId: number, experienceId: number): Promise<AiResume> {
    return await this.prisma.aiResume.findFirst({ where: { userId, experienceId } });
  }

  public async findByUserId(userId: number, aiKeyword?: string) {
    let where = <Prisma.AiResumeWhereInput>{ userId };

    if (aiKeyword) {
      where = { userId, AiResumeCapabilities: { some: { Capability: { keyword: { equals: aiKeyword } } } } };
    }

    return await this.prisma.aiResume.findMany({
      select: {
        id: true,
        content: true,
        updatedAt: true,
        experienceId: true,
        AiResumeCapabilities: { select: { Capability: { select: { keyword: true } } } },
      },
      where,
    });
  }

  public async countByUserId(userId: number, aiKeyword?: string): Promise<number> {
    let where = <Prisma.AiResumeWhereInput>{ userId };

    if (aiKeyword) {
      where = { userId, AiResumeCapabilities: { some: { Capability: { keyword: { equals: aiKeyword } } } } };
    }

    return await this.prisma.aiResume.count({ where });
  }
}
