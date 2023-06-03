import { Controller } from '@nestjs/common';
import { OnboardingsService } from '🔥apps/server/onboarding/onboarding.service';

@Controller('onboardings')
export class OnboardingsController {
  constructor(private readonly onboardingsService: OnboardingsService) {}
}
