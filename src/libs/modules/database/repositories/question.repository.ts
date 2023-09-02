import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from './abstract.repository';
import { PrismaService } from '../prisma.service';

type QuestionDelegate = Prisma.QuestionDelegate<DefaultArgs>;

@Injectable()
export class QuestionRepository extends AbstractRepository<
  QuestionDelegate,
  DelegateArgs<QuestionDelegate>,
  DelegateReturnTypes<QuestionDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.question, prisma.readonlyInstance.question);
  }
}
