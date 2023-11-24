import { Module } from '@nestjs/common';

import { OnboardingsController } from '@apps/server/onboardings/onboarding.controller';
import { OnboardingsService } from '@apps/server/onboardings/onboarding.service';
import { OnboardingRepository } from '@libs/modules/database/repositories/onboarding/onboarding.interface';
import { OnboardingRepositoryImpl } from '@libs/modules/database/repositories/onboarding/onboarding.repository';

@Module({
  controllers: [OnboardingsController],
  providers: [OnboardingsService, { provide: OnboardingRepository, useClass: OnboardingRepositoryImpl }],
  exports: [OnboardingsService],
})
export class OnboardingsModule {}
