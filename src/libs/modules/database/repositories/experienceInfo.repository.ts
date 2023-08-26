import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';

import { PrismaService } from '../prisma.service';

type ExperienceInfoDelegate = Prisma.ExperienceInfoDelegate<DefaultArgs>;

@Injectable()
export class ExperienceInfoRepository extends AbstractRepository<
  ExperienceInfoDelegate,
  DelegateArgs<ExperienceInfoDelegate>,
  DelegateReturnTypes<ExperienceInfoDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.experienceInfo, prisma.readonlyInstance.experienceInfo);
  }
}
