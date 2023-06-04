import { Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import {
  GetOnboardingSummaryMd,
  GetOnboardingDescriptionMd,
  GetOnBoardingResponseDescription,
} from '🔥apps/server/onboarding/docs/get-onboarding.doc';
import { GetAllOnboardingsResponseDto } from '🔥apps/server/onboarding/dtos/get-onboarding.dto';
import { OnboardingsService } from '🔥apps/server/onboarding/onboarding.service';

@ApiTags('🏂 온보딩 API')
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
      description: GetOnBoardingResponseDescription,
    },
    summary: GetOnboardingSummaryMd,
    description: GetOnboardingDescriptionMd,
  })
  async getAllOnboardings(@User() user: UserJwtToken): Promise<ResponseEntity<GetAllOnboardingsResponseDto>> {
    const onboarding = await this.onboardingsService.getAllOnboardings(user.userId);

    return ResponseEntity.OK_WITH_DATA(onboarding);
  }
}
