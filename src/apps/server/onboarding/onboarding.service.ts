import { Injectable } from '@nestjs/common';
import { OnboardingRepository } from '📚libs/modules/database/repositories/onboarding.repository';

@Injectable()
export class OnboardingsService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}
}
