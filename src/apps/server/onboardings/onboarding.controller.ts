import { Body, Controller, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserJwtToken } from '@apps/server/auth/types/jwtToken.type';
import { User } from '@apps/server/common/decorators/req/user.decorator';
import { Route } from '@apps/server/common/decorators/routers/route.decorator';
import { JwtAuthGuard } from '@apps/server/common/guards/jwtAuth.guard';
import { PatchOnboardingRequestBodyDto, PatchOnboardingResponseDto } from '@apps/server/onboardings/dtos/req/patchOnboarding.dto';
import { GetAllOnboardingsResponseDto } from '@apps/server/onboardings/dtos/res/getOnboarding.dto';
import { OnboardingsService } from '@apps/server/onboardings/onboarding.service';
import { Method } from '@libs/enums/method.enum';
import { ResponseEntity } from '@libs/utils/respone.entity';

import * as OnboardingDocs from './docs/onboarding.doc';

@ApiTags('🏂 온보딩 API')
@UseGuards(JwtAuthGuard)
@Controller('onboardings')
export class OnboardingsController {
  constructor(private readonly onboardingsService: OnboardingsService) {}

  @Route({
    request: {
      path: '',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      description: OnboardingDocs.getOnBoardingResponseDescription,
      type: GetAllOnboardingsResponseDto,
    },
    summary: OnboardingDocs.getOnboardingSummaryMd,
    description: OnboardingDocs.getOnboardingDescriptionMd,
  })
  async getAllOnboardings(@User() user: UserJwtToken): Promise<ResponseEntity<GetAllOnboardingsResponseDto>> {
    const onboarding = await this.onboardingsService.getAllOnboardings(user.userId);

    return ResponseEntity.OK_WITH_DATA(onboarding);
  }

  @Route({
    request: {
      path: '',
      method: Method.PATCH,
    },
    response: {
      code: HttpStatus.OK,
      type: PatchOnboardingResponseDto,
      description: OnboardingDocs.patchOnboardingResponseDescriptionMd,
    },
    summary: OnboardingDocs.patchOnboardingSummaryMd,
    description: OnboardingDocs.patchOnboardingDescriptionMd,
  })
  async updateOnboarding(
    @User() user: UserJwtToken,
    @Body() patchOnboardingRequestBodyDto: PatchOnboardingRequestBodyDto,
  ): Promise<ResponseEntity<PatchOnboardingResponseDto>> {
    const updatedOnboarding = await this.onboardingsService.updateOnboarding(user.userId, patchOnboardingRequestBodyDto);

    return ResponseEntity.OK_WITH_DATA(updatedOnboarding);
  }
}
