import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { CollectionsService } from '🔥apps/server/collections/collection.service';
import {
  GetCountOfExperienceAndCapabilityDescriptionMd,
  GetCountOfExperienceAndCapabilityResponseDescriptionMd,
  GetCountOfExperienceAndCapabilitySummaryMd,
} from '🔥apps/server/collections/docs/get-count-of-experience-and-capability.doc';
import {
  GetCountOfExperienceAndResumeDescriptionMd,
  GetCountOfExperienceAndResumeResponseDescriptionMd,
  GetCountOfExperienceAndResumeSummaryMd,
} from '🔥apps/server/collections/docs/get-count-of-experience-and-resume.doc';
import { GetCountOfExperienceAndCapabilityResponseDto } from '🔥apps/server/collections/dtos/get-count-of-experience-and-capability.dto';
import { GetCountOfExperienceAndResumeResponseDto } from '🔥apps/server/collections/dtos/get-count-of-experience-and-resume.dto';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';

@ApiTags('🔍 모아보기 관련 API')
@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Route({
    request: {
      path: '',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      description: GetCountOfExperienceAndResumeResponseDescriptionMd,
    },
    summary: GetCountOfExperienceAndResumeSummaryMd,
    description: GetCountOfExperienceAndResumeDescriptionMd,
  })
  async getCountOfExperienceAndResume(@User() user: UserJwtToken): Promise<ResponseEntity<GetCountOfExperienceAndResumeResponseDto>> {
    const countOfExperienceAndResume = await this.collectionsService.getCountOfExperienceAndResume(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfExperienceAndResume);
  }

  @Route({
    request: {
      path: 'experience',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetCountOfExperienceAndCapabilityResponseDto,
      isArray: true,
      description: GetCountOfExperienceAndCapabilityResponseDescriptionMd,
    },
    summary: GetCountOfExperienceAndCapabilitySummaryMd,
    description: GetCountOfExperienceAndCapabilityDescriptionMd,
  })
  async getCountOfExperienceAndCapability(
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetCountOfExperienceAndCapabilityResponseDto[]>> {
    const countOfExperienceAndCapability = await this.collectionsService.getCountOfExperienceAndCapability(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfExperienceAndCapability);
  }
}
