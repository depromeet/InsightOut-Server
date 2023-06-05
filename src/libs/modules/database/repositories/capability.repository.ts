import { Injectable } from '@nestjs/common';
import { Capability, Prisma } from '@prisma/client';
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

  public async countExperienceAndCapability(userId: number): Promise<Capability[]> {
    return await this.findMany({
      where: { userId },
      include: {
        _count: { select: { ExperienceCapability: true } },
        ExperienceCapability: { orderBy: { Experience: { createdAt: 'desc' } } },
      },
      distinct: 'keyword',
      orderBy: { ExperienceCapability: { _count: 'desc' } },
    });
  }
}
