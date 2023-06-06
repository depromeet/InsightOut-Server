import { Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { AiService } from '🔥apps/server/ai/ai.service';
import { CreateAiKeywordsAndResumeBodyReqDto } from '🔥apps/server/ai/dto/req/createAiKeywordsAndResume.req.dto';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { RouteTable } from '🔥apps/server/common/decorators/router/route-table.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RouteTable({
  path: 'ai',
  tag: {
    title: '🤖 AI API',
  },
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      // type: CreateExperienceCapabilitiesResDto,
    },
    // description: createManyExperienceCapabilitiesSuccMd,
    summary: '✅ Ai 추천 키워드, 자기소개서 추가 API',
  })
  public async createManyExperienceCapabilities(
    @Body() createAiKeywordsAndResumeBodyReqDto: CreateAiKeywordsAndResumeBodyReqDto,
    @User() user: UserJwtToken,
  ) {
    const newAi = await this.aiService.create(createAiKeywordsAndResumeBodyReqDto, user);

    return ResponseEntity.CREATED_WITH_DATA(newAi);
  }
}
