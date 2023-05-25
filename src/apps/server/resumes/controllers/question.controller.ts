import {
  Body,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RouteTable } from '../../decorators/router/route-table.decorator';
import { QuestionsService } from '../services/question.service';
import { User } from '../../decorators/request/user.decorator';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '@libs/utils/respone.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Route } from '../../decorators/router/route.decorator';
import { PostQuestionResponseDto } from '../dtos/post-question.dto';
import { Method } from '@libs/enums/method.enum';
import { PatchQuestionRequestBodyDto } from '@apps/server/resumes/dtos/patch-question-request.dto';

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
    description:
      '자기소개서 폴더 아래 문항 추가 버튼을 눌러서 문항을 추가합니다. 빈 문항만 추가됩니다.',
  })
  async createOneQuestion(
    @Param('resumeId', ParseIntPipe) resumeId: number,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PostQuestionResponseDto>> {
    const question = await this.questionService.createOneQuestion(
      user.userId,
      resumeId,
    );

    return ResponseEntity.CREATED_WITH_DATA(question);
  }

  @Route({
    request: {
      path: ':questionId',
      method: Method.PATCH,
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '자기소개서 문항 수정',
    description: '자기소개서 문항 제목 및 내용 수정',
  })
  async updateOneQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() body: PatchQuestionRequestBodyDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<string>> {
    await this.questionService.updateOneQuestion({
      body,
      questionId,
      userId: user.userId,
    });

    return ResponseEntity.OK_WITH_MESSAGE('Resume question updated');
  }
}
