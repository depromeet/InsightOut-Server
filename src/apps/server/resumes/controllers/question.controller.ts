import { UseGuards, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { RouteTable } from '🔥apps/server/common/decorators/router/route-table.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { PostQuestionResponseDto } from '🔥apps/server/resumes/dtos/post-question.dto';
import { QuestionsService } from '🔥apps/server/resumes/services/question.service';

@RouteTable({
  path: 'resumes/questions',
  tag: {
    title: 'resumes/questions',
  },
})
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Route({
    request: {
      path: ':resumeId',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: PostQuestionResponseDto,
    },
    summary: '자기소개서 문항 추가',
    description: '자기소개서 폴더 아래 문항 추가 버튼을 눌러서 문항을 추가합니다. 빈 문항만 추가됩니다.',
  })
  async createOneQuestion(
    @Param('resumeId', ParseIntPipe) resumeId: number,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PostQuestionResponseDto>> {
    const question = await this.questionService.createOneQuestion(user.userId, resumeId);

    return ResponseEntity.CREATED_WITH_DATA(question);
  }
}
