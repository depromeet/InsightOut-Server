import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { ResumeRepository } from '@libs/modules/database/repositories/resume/resume.interface';

import { PrismaService } from '../../prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '../abstract.repository';

type ResumeDelegate = Prisma.ResumeDelegate<DefaultArgs>;

@Injectable()
export class ResumeRepositoryImpl
  extends AbstractRepository<ResumeDelegate, DelegateArgs<ResumeDelegate>, DelegateReturnTypes<ResumeDelegate>>
  implements ResumeRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.resume);
  }
}
