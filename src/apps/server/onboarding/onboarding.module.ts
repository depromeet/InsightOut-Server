import { Module } from '@nestjs/common';
import { OnboardingRepository } from '📚libs/modules/database/repositories/onboarding.repository';
import { OnboardingsController } from '🔥apps/server/onboarding/onboarding.controller';
import { OnboardingsService } from '🔥apps/server/onboarding/onboarding.service';

@Module({
  controllers: [OnboardingsController],
  providers: [OnboardingsService, OnboardingRepository],
})
export class OnboardingsModule {}
