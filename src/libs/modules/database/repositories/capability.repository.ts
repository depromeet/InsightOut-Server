import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
}
