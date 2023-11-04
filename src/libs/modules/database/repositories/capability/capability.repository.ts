import { Injectable } from '@nestjs/common';
import { Capability, ExperienceStatus, KeywordType, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { CountExperienceAndCapability } from '@apps/server/experiences/types/countExperienceAndCapability.type';
import { PrismaService } from '@libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';
import { CapabilityRepository } from '@libs/modules/database/repositories/capability/capability.interface';

type CapabilityDelegate = Prisma.CapabilityDelegate<DefaultArgs>;

@Injectable()
export class CapabilityRepositoryImpl
  extends AbstractRepository<CapabilityDelegate, DelegateArgs<CapabilityDelegate>, DelegateReturnTypes<CapabilityDelegate>>
  implements CapabilityRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.capability);
  }

  public async countExperienceAndCapability(userId: number, isCompleted?: boolean): Promise<CountExperienceAndCapability[]> {
    const where = <Prisma.CapabilityWhereInput>{ userId };
    if (isCompleted === true) {
      where.ExperienceCapabilities = { some: { Experience: { is: { experienceStatus: ExperienceStatus.DONE } } } };
    }

    return (await this.findMany({
      where,
      orderBy: { ExperienceCapabilities: { _count: 'desc' } },
      select: {
        _count: { select: { ExperienceCapabilities: true } },
        id: true,
        keyword: true,
        ExperienceCapabilities: {
          orderBy: { Experience: { createdAt: 'desc' } },
          select: {
            Experience: {
              select: {
                title: true,
                situation: true,
                task: true,
                action: true,
                result: true,
                startDate: true,
                endDate: true,
                experienceStatus: true,
                summaryKeywords: true,
                ExperienceInfo: true,
                AiResume: true,
                AiRecommendQuestions: true,
                ExperienceCapabilities: true,
              },
            },
          },
        },
      },
      distinct: 'keyword',
    })) as unknown as CountExperienceAndCapability[];
  }

  public async findByUserId(userId: number): Promise<Capability[]> {
    return await this.findMany({ where: { userId, keywordType: KeywordType.AI }, select: { keyword: true } });
  }
}
