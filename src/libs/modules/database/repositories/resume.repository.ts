import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from './abstract.repository';
import { PrismaService } from '../prisma.service';

type ResumeDelegate = Prisma.ResumeDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

@Injectable()
export class ResumeRepository extends AbstractRepository<
  ResumeDelegate,
  DelegateArgs<ResumeDelegate>,
  DelegateReturnTypes<ResumeDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.resume);
  }
}
