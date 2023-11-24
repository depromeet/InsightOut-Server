import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { QuestionRepository } from '@libs/modules/database/repositories/question/question.interface';

import { PrismaService } from '../../prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '../abstract.repository';

type QuestionDelegate = Prisma.QuestionDelegate<DefaultArgs>;

@Injectable()
export class QuestionRepositoryImpl
  extends AbstractRepository<QuestionDelegate, DelegateArgs<QuestionDelegate>, DelegateReturnTypes<QuestionDelegate>>
  implements QuestionRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.question);
  }
}
