import { BadRequestException, Injectable } from '@nestjs/common';
import { Onboarding } from '@prisma/client';
import { OnboardingRepository } from '📚libs/modules/database/repositories/onboarding.repository';
import { PatchOnboardingResponseDto } from '🔥apps/server/onboardings/dtos/req/patchOnboarding.dto';
import { GetAllOnboardingsResponseDto } from '🔥apps/server/onboardings/dtos/res/getOnboarding.dto';

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

  async updateOnboarding(userId: number, onboardings: Omit<Partial<Onboarding>, 'userId'>): Promise<PatchOnboardingResponseDto> {
    if (!Object.keys(onboardings).length) {
      throw new BadRequestException('Please include onboarding at least 1.');
    }

    const updatedOnboarding = await this.onboardingRepository.update({
      where: { userId },
      data: onboardings,
    });

    const updateOnboardingResponseDto = new PatchOnboardingResponseDto(updatedOnboarding);
    return updateOnboardingResponseDto;
  }
}
