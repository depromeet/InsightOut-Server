import { Injectable } from '@nestjs/common';
import { ExperienceStatus, KeywordType, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { CountExperienceAndCapability } from '@apps/server/experiences/types/countExperienceAndCapability.type';
import { Capability } from '@libs/modules/database/entities/capability/capability.entity';
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

  public async findByUserId(userId: number): Promise<Partial<Capability>[]> {
    return await this.findMany({ where: { userId, keywordType: KeywordType.AI }, select: { keyword: true } });
  }

  public async findOneByUserIdAndKeyword(userId: number, keyword: string): Promise<Partial<Capability>>;
  public async findOneByUserIdAndKeyword(userId: number, keyword: string, keywordType?: KeywordType): Promise<Partial<Capability>> {
    if (keywordType) {
      return this.findFirst({ where: { userId, keyword, keywordType } });
    }
    return this.findFirst({ where: { userId, keyword } });
  }

  async save(capability: Capability): Promise<Partial<Capability>> {
    return this.create({ data: capability as Prisma.CapabilityCreateInput });
  }
}
