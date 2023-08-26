import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from './abstract.repository';
import { PrismaService } from '../prisma.service';

type ResumeDelegate = Prisma.ResumeDelegate<DefaultArgs>;

@Injectable()
export class ResumeRepository extends AbstractRepository<
  ResumeDelegate,
  DelegateArgs<ResumeDelegate>,
  DelegateReturnTypes<ResumeDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.resume, prisma.readonlyInstance.resume);
  }
}
