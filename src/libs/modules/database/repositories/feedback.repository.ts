import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '📚libs/modules/database/repositories/abstract.repository';

type FeedbackDelegate = Prisma.FeedbackDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

@Injectable()
export class FeedbackRepository extends AbstractRepository<
  FeedbackDelegate,
  DelegateArgs<FeedbackDelegate>,
  DelegateReturnTypes<FeedbackDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.feedback);
  }
}
