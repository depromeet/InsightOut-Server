import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '@libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';
import { OnboardingRepository } from '@libs/modules/database/repositories/onboarding/onboarding.interface';

type OnboardingDelegate = Prisma.OnboardingDelegate<DefaultArgs>;

@Injectable()
export class OnboardingRepositoryImpl
  extends AbstractRepository<OnboardingDelegate, DelegateArgs<OnboardingDelegate>, DelegateReturnTypes<OnboardingDelegate>>
  implements OnboardingRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.onboarding);
  }
}
