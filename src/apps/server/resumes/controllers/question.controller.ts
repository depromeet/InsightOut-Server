import { UseGuards, HttpStatus, Param, Body, ParseIntPipe, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { SpellCheckResult } from '📚libs/modules/api/api.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import {
  PatchQuestionDescriptionMd,
  PatchQuestionResponseDescriptionMd,
  PatchQuestionSummaryMd,
} from '🔥apps/server/resumes/docs/patch-question.doc';
import {
  PostSpellCheckDescriptionMd,
  PostSpellCheckResponseDescriptionMd,
  PostSpellCheckSummaryMd,
} from '🔥apps/server/resumes/docs/post-spell-check.doc';
import { GetOneQuestionRequestParamDto, GetOneQuestionResponseDto } from '🔥apps/server/resumes/dtos/get-question.dto';
import {
  PatchQuestionRequestParamDto,
  PatchQuestionRequestBodyDto,
  PatchQuestionResponseDto,
} from '🔥apps/server/resumes/dtos/patch-question-request.dto';
import { PostQuestionResponseDto, PostQuestionRequestBodyDto } from '🔥apps/server/resumes/dtos/post-question.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';
import { QuestionsService } from '🔥apps/server/resumes/services/question.service';

@ApiTags('📑 자기소개서 문항 API')
@Controller('resumes/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Route({
    request: {
      path: '',
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
    const checkedSpell = await this.questionService.spellCheck(body);

    return ResponseEntity.OK_WITH_DATA(checkedSpell);
  }

  /**
   * 자기소개서 문항 한 개를 조회합니다.
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
      description: '### ✅ 자기소개서 문항 조회에 성공헀습니다.\n',
    },
    summary: '자기소개서 문항 조회 API',
    description:
      '# 자기소개서 문항 조회 API\n## Description\n자기소개서 문항을 한 개 조회합니다. 리소스를 식별하기에 path parameter를 요청으로 기대합니다. 자기소개서 문항의 id 값과, 제목, 답안, 생성일자, 수정일자를 응답으로 전달합니다.\n## Picture\n![image](https://github.com/depromeet/13th-4team-backend/assets/83271772/bd82d7bf-4744-4a48-81d5-85c7481d5d77)\n## Figma\n⛳️ [자기소개서 조회 - 자기소개서 작성 첫 화면](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=oMTkLrgQjXJOPb8D-4)',
  })
  async getOneQuestion(
    @Param() getOneQuestionRequestParamDto: GetOneQuestionRequestParamDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<GetOneQuestionResponseDto>> {
    const question = await this.questionService.getOneQuestion(user.userId, getOneQuestionRequestParamDto.questionId);

    return ResponseEntity.OK_WITH_DATA(question);
  }

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

  @Route({
    request: {
      path: ':questionId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '자기소개서 문항 삭제 API',
    description: '자기소개서 문항을 삭제합니다.',
  })
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number, @User() user: UserJwtToken): Promise<ResponseEntity<string>> {
    await this.questionService.deleteQuestion({
      questionId,
      userId: user.userId,
    });

    return ResponseEntity.OK_WITH_MESSAGE('Resume question deleted');
  }
}
