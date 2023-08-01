import { Module } from '@nestjs/common';
import { OnboardingRepository } from '📚libs/modules/database/repositories/onboarding.repository';
import { OnboardingsController } from '🔥apps/server/onboardings/onboarding.controller';
import { OnboardingsService } from '🔥apps/server/onboardings/onboarding.service';

@Module({
  controllers: [OnboardingsController],
  providers: [OnboardingsService, OnboardingRepository],
  exports: [OnboardingsService],
})
export class OnboardingsModule {}
