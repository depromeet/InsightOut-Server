import { Module } from '@nestjs/common';
import { OnboardingsController } from '🔥apps/server/onboarding/onboarding.controller';
import { OnboardingsService } from '🔥apps/server/onboarding/onboarding.service';

@Module({
  controllers: [OnboardingsController],
  providers: [OnboardingsService],
})
export class OnboardingsModule {}
