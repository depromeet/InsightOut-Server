import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '@libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';
import { FeedbackRepository } from '@libs/modules/database/repositories/feedback/feedback.interface';

type FeedbackDelegate = Prisma.FeedbackDelegate<DefaultArgs>;

@Injectable()
export class FeedbackRepositoryImpl
  extends AbstractRepository<FeedbackDelegate, DelegateArgs<FeedbackDelegate>, DelegateReturnTypes<FeedbackDelegate>>
  implements FeedbackRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.feedback);
  }
}
