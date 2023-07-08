import { Injectable } from '@nestjs/common';
import { Capability, ExperienceStatus, KeywordType, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '📚libs/modules/database/repositories/abstract.repository';

type CapabilityDelegate = Prisma.CapabilityDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

@Injectable()
export class CapabilityRepository extends AbstractRepository<
  CapabilityDelegate,
  DelegateArgs<CapabilityDelegate>,
  DelegateReturnTypes<CapabilityDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.capability);
  }

  public async countExperienceAndCapability(userId: number, isCompleted?: boolean): Promise<Capability[]> {
    const where = <Prisma.CapabilityWhereInput>{ userId };
    if (isCompleted === true) {
      where.ExperienceCapability = { some: { Experience: { is: { experienceStatus: ExperienceStatus.DONE } } } };
    }

    return await this.findMany({
      where,
      orderBy: { ExperienceCapability: { _count: 'desc' } },
      select: {
        _count: { select: { ExperienceCapability: true } },
        id: true,
        keyword: true,
        ExperienceCapability: { orderBy: { Experience: { createdAt: 'desc' } } },
      },
      distinct: 'keyword',
    });
  }

  public async findAiResumeCapabilities(userId: number): Promise<Capability[]> {
    return await this.findMany({ where: { userId, keywordType: KeywordType.AI }, select: { keyword: true } });
  }
}
