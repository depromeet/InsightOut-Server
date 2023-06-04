import { Injectable } from '@nestjs/common';
import { OnboardingRepository } from '📚libs/modules/database/repositories/onboarding.repository';
import { GetAllOnboardingsResponseDto } from '🔥apps/server/onboarding/dtos/get-onboarding.dto';

@Injectable()
export class OnboardingsService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  async getAllOnboardings(userId: number): Promise<GetAllOnboardingsResponseDto> {
    const onboarding = await this.onboardingRepository.findFirst({
      where: { userId },
    });

    const onboardingResponseDto = new GetAllOnboardingsResponseDto(onboarding);
    return onboardingResponseDto;
  }
}
