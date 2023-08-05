import { UseGuards, HttpStatus, Param, Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserJwtToken } from '@apps/server/auth/types/jwtToken.type';
import { User } from '@apps/server/common/decorators/req/user.decorator';
import { Route } from '@apps/server/common/decorators/routers/route.decorator';
import { JwtAuthGuard } from '@apps/server/common/guards/jwtAuth.guard';
import {
  DeleteQuestionDescriptionMd,
  DeleteQuestionResponseDescriptionMd,
  DeleteQuestionSummaryMd,
} from '@apps/server/resumes/docs/questions/deleteQuestion.doc';
import {
  GetOneQuestionDescriptionMd,
  GetOneQuestionResponseDescriptionMd,
  GetOneQuestionSummaryMd,
} from '@apps/server/resumes/docs/questions/getQuestion.doc';
import {
  PatchQuestionDescriptionMd,
  PatchQuestionResponseDescriptionMd,
  PatchQuestionSummaryMd,
} from '@apps/server/resumes/docs/questions/patchQuestion.doc';
import {
  PostQuestionDesciptionMd,
  PostQuestionResponseDescriptionMd,
  PostQuestionSummaryMd,
} from '@apps/server/resumes/docs/questions/postQuestion.doc';
import {
  PostSpellCheckDescriptionMd,
  PostSpellCheckResponseDescriptionMd,
  PostSpellCheckSummaryMd,
} from '@apps/server/resumes/docs/questions/postSpellCheck.doc';
import { DeleteQuestionRequestParamDto } from '@apps/server/resumes/dtos/questions/req/deleteQuestion.dto';
import { GetOneQuestionRequestParamDto, GetOneQuestionResponseDto } from '@apps/server/resumes/dtos/questions/req/getQuestion.dto';
import {
  PatchQuestionRequestBodyDto,
  PatchQuestionRequestParamDto,
  PatchQuestionResponseDto,
} from '@apps/server/resumes/dtos/questions/req/patchQuestion.dto';
import { PostQuestionRequestBodyDto, PostQuestionResponseDto } from '@apps/server/resumes/dtos/questions/req/postQuestion.dto';
import { PostSpellCheckRequestBodyDto } from '@apps/server/resumes/dtos/questions/req/postSpellCheck.dto';
import { QuestionsService } from '@apps/server/resumes/services/question.service';
import { Method } from '@libs/enums/method.enum';
import { SpellCheckResult } from '@libs/modules/api/api.type';
import { ResponseEntity } from '@libs/utils/respone.entity';

@ApiTags('📑 자기소개서 문항 API')
@Controller('resumes/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  /**
   * ✅ 한 개의 자기소개서 문항 조회 API
   *
   * 자기소개서 id(resumeId)와 유저 id(userId)를 통해서 자기소개서 문항을 한 개 가져옵니다.
   * 응답으로는 해당 문항에 대한 정보를 반환합니다.
   *
   * @param getOneQuestionRequestParamDto resumeId를 담은 param 클래스
   * @param user request 객체의 user 값
   * @returns 자기소개서 문항 한 개에 대한 데이터
   */
  @Route({
    request: {
      path: ':questionId',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetOneQuestionResponseDto,
      description: GetOneQuestionResponseDescriptionMd,
    },
    summary: GetOneQuestionSummaryMd,
    description: GetOneQuestionDescriptionMd,
  })
  async getOneQuestion(
    @Param() getOneQuestionRequestParamDto: GetOneQuestionRequestParamDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetOneQuestionResponseDto>> {
    const question = await this.questionService.getOneQuestion(user.userId, getOneQuestionRequestParamDto.questionId);

    return ResponseEntity.OK_WITH_DATA(question);
  }

  // ✅ 자기소개서 문항 추가 API
  @Route({
    request: {
      path: '',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: PostQuestionResponseDto,
      description: PostQuestionResponseDescriptionMd,
    },
    summary: PostQuestionSummaryMd,
    description: PostQuestionDesciptionMd,
  })
  async createOneQuestion(
    @Body() postQuestionRequestParamDto: PostQuestionRequestBodyDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PostQuestionResponseDto>> {
    const question = await this.questionService.createOneQuestion(user.userId, postQuestionRequestParamDto.resumeId);

    return ResponseEntity.CREATED_WITH_DATA(question);
  }

  @Route({
    request: {
      path: 'spell-check',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.OK,
      description: PostSpellCheckResponseDescriptionMd,
      type: SpellCheckResult,
      isArray: true,
    },
    summary: PostSpellCheckSummaryMd,
    description: PostSpellCheckDescriptionMd,
  })
  async spellCheck(@Body() body: PostSpellCheckRequestBodyDto) {
    const checkedSpell = await this.questionService.spellCheck({ body: body });

    return ResponseEntity.OK_WITH_DATA(checkedSpell);
  }

  // ✅ 자기소개서 문항 수정 API
  @Route({
    request: {
      path: ':questionId',
      method: Method.PATCH,
    },
    response: {
      code: HttpStatus.OK,
      type: PatchQuestionResponseDto,
      description: PatchQuestionResponseDescriptionMd,
    },
    summary: PatchQuestionSummaryMd,
    description: PatchQuestionDescriptionMd,
  })
  async updateOneQuestion(
    @Param() patchQuestionRequestParamDto: PatchQuestionRequestParamDto,
    @Body() body: PatchQuestionRequestBodyDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PatchQuestionResponseDto>> {
    const updatedQuestion = await this.questionService.updateOneQuestion(body, patchQuestionRequestParamDto.questionId, user.userId);

    return ResponseEntity.OK_WITH_DATA(updatedQuestion);
  }

  // ✅ 자기소개서 문항 삭제 API
  @Route({
    request: {
      path: ':questionId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
      type: String,
      description: DeleteQuestionResponseDescriptionMd,
    },
    summary: DeleteQuestionSummaryMd,
    description: DeleteQuestionDescriptionMd,
  })
  async deleteQuestion(
    @Param() deleteQuestionRequestParamDto: DeleteQuestionRequestParamDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<string>> {
    await this.questionService.deleteQuestion({
      questionId: deleteQuestionRequestParamDto.questionId,
      userId: user.userId,
    });

    return ResponseEntity.OK_WITH_MESSAGE('Resume question deleted');
  }
}
