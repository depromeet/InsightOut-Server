import { Injectable } from '@nestjs/common';
import { AiResume, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';

import { PrismaService } from '../prisma.service';

type AiResumeDelegate = Prisma.AiResumeDelegate<DefaultArgs>;

@Injectable()
export class AiResumeRepository extends AbstractRepository<
  AiResumeDelegate,
  DelegateArgs<AiResumeDelegate>,
  DelegateReturnTypes<AiResumeDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.aiResume, prisma.readonlyInstance.aiResume);
  }

  public async findOneByFilter(where: Prisma.AiResumeWhereInput): Promise<AiResume> {
    return await this.findFirst({ where });
  }

  public async getAiResumeByUserId(userId: number, aiKeyword?: string) {
    let where = <Prisma.AiResumeWhereInput>{ userId };

    if (aiKeyword) {
      where = { userId, AiResumeCapabilities: { some: { Capability: { keyword: { equals: aiKeyword } } } } };
    }

    return await this.findMany({
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

  public async getAiResumeCount(userId: number, aiKeyword?: string): Promise<number> {
    let where = <Prisma.AiResumeWhereInput>{ userId };

    if (aiKeyword) {
      where = { userId, AiResumeCapabilities: { some: { Capability: { keyword: { equals: aiKeyword } } } } };
    }

    return await this.count({ where });
  }
}
