import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '📚libs/modules/database/repositories/abstract.repository';

type OnboardingDelegate = Prisma.OnboardingDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

@Injectable()
export class OnboardingRepository extends AbstractRepository<
  OnboardingDelegate,
  DelegateArgs<OnboardingDelegate>,
  DelegateReturnTypes<OnboardingDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.onboarding);
  }
}
