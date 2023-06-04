import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { CollectionsService } from '🔥apps/server/collections/collection.service';
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
      path: 'count',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
    },
  })
  async getCountOfExperienceAndResume(@User() user: UserJwtToken): Promise<ResponseEntity<GetCountOfExperienceAndResumeResponseDto>> {
    const countOfExperienceAndResume = await this.collectionsService.getCountOfExperienceAndResume(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfExperienceAndResume);
  }
}
