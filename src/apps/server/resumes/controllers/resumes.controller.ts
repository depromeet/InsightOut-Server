import { UseGuards, Controller, Query, HttpStatus, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiParam, ApiProduces } from '@nestjs/swagger';
import { SuccessResponse } from '📚libs/decorators/success-response.dto';

import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import {
  DeleteResumeDescriptionMd,
  DeleteResumeResponseDescriptionMd,
  DeleteResumeSummaryMd,
} from '🔥apps/server/resumes/docs/delete-resume.doc';
import {
  GetCountOfResumeDescriptionMd,
  GetCountOfResumeResponseDescriptionMd,
  GetCountOfResumeSummaryMd,
} from '🔥apps/server/resumes/docs/get-count-of-resume.dto';
import {
  GetAllResumeDescriptionMd,
  GetAllResumeResponseDescriptionMd,
  GetAllResumeSummaryMd,
  GetAllResumesTitleDescriptionMd,
  GetAllResumesTitleResponseDescriptionMd,
  GetAllResumesTitleSummaryMd,
  GetOneResumeDescriptionMd,
  GetOneResumeResponseDescriptionMd,
  GetOneResumeSummaryMd,
} from '🔥apps/server/resumes/docs/get-resume.doc';
import { PostResumeDescriptionMd, PostResumeResponseDescriptionMd, PostResumeSummaryMd } from '🔥apps/server/resumes/docs/post-resume.doc';
import { GetCountOfResumeResponseDto } from '🔥apps/server/resumes/dtos/get-count-of-resume.dto';
import {
  GetAllResumeRequestQueryDto,
  GetOneResumeRequestParamDto,
  GetOneResumeResponseDto,
  GetOneResumeWithAnswerResponseDto,
  GetOneResumeWithTitleResponseDto,
} from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeResponseDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { ResumesService } from '🔥apps/server/resumes/services/resumes.service';

@ApiTags('🗂️ 자기소개서 API')
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  // ✅ 자기소개서 전체 조회
  @SuccessResponse(HttpStatus.OK, [
    {
      model: GetOneResumeResponseDto,
      exampleDescription: 'answer가 false인 경우, 답안을 반환하지 않습니다.',
      exampleTitle: 'answer가 false인 경우',
    },
    {
      model: GetOneResumeWithAnswerResponseDto,
      exampleDescription: 'answer가 true인 경우, 답안을 함께 반환합니다.',
      exampleTitle: 'answer가 true인 경우',
    },
  ])
  @Route({
    request: {
      path: '',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetOneResumeResponseDto,
      isArray: true,
      description: GetAllResumeResponseDescriptionMd,
    },
    summary: GetAllResumeSummaryMd,
    description: GetAllResumeDescriptionMd,
  })
  @ApiQuery({
    description: '자기소개서를 조회할 때 사용할 쿼리입니다. false를 입력 시 자기소개서만 조회하고, true를 입력 시 문항도 함께 조회합니다.',
    type: GetAllResumeRequestQueryDto,
  })
  async getAllResumes(
    @User() user: UserJwtToken,
    @Query() getAllResumeRequestQueryDto: GetAllResumeRequestQueryDto,
  ): Promise<ResponseEntity<GetOneResumeResponseDto[]>> {
    const resumes = await this.resumesService.getAllResumes(user.userId, getAllResumeRequestQueryDto);

    return ResponseEntity.OK_WITH_DATA(resumes);
  }

  // ✅ 자기소개서 제목 조회 -> 모아보기 제목별 필터링에 사용
  @Route({
    request: {
      path: 'title',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetOneResumeWithTitleResponseDto,
      isArray: true,
      description: GetAllResumesTitleResponseDescriptionMd,
    },
    summary: GetAllResumesTitleSummaryMd,
    description: GetAllResumesTitleDescriptionMd,
  })
  async getAllReumesTitle(@User() user: UserJwtToken): Promise<ResponseEntity<GetOneResumeWithTitleResponseDto[]>> {
    const resumeTitleWithResumeId = await this.resumesService.getAllResumesTitle(user.userId);

    return ResponseEntity.OK_WITH_DATA(resumeTitleWithResumeId);
  }

  // ✅ 자기소개서 개수 조회 -> 모아보기 최상단 자기소개서 개수 출력에 사용
  @Route({
    request: {
      path: 'count',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetCountOfResumeResponseDto,
      description: GetCountOfResumeResponseDescriptionMd,
    },
    summary: GetCountOfResumeSummaryMd,
    description: GetCountOfResumeDescriptionMd,
  })
  async getCountOfResume(@User() user: UserJwtToken): Promise<ResponseEntity<GetCountOfResumeResponseDto>> {
    const countOfResume = await this.resumesService.getCountOfResume(user.userId);

    return ResponseEntity.OK_WITH_DATA(countOfResume);
  }

  // ✅ 특정 자기소개서 조회 API
  @Route({
    request: {
      path: ':resumeId',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetOneResumeResponseDto,
      description: GetOneResumeResponseDescriptionMd,
    },
    summary: GetOneResumeSummaryMd,
    description: GetOneResumeDescriptionMd,
  })
  public async getOneResume(
    @User() user: UserJwtToken,
    @Param() getOneResumeRequestParamDto: GetOneResumeRequestParamDto,
  ): Promise<ResponseEntity<GetOneResumeResponseDto>> {
    const resume = await this.resumesService.getOneResume(user.userId, getOneResumeRequestParamDto.resumeId);

    return ResponseEntity.OK_WITH_DATA(resume);
  }

  // ✅ 자기소개서 추가 API
  @Route({
    request: {
      path: '',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      description: PostResumeResponseDescriptionMd,
      type: PostResumeResponseDto,
    },
    summary: PostResumeSummaryMd,
    description: PostResumeDescriptionMd,
  })
  async createResumeFolder(@User() user: UserJwtToken): Promise<ResponseEntity<PostResumeResponseDto>> {
    const resume = await this.resumesService.createResumeFolder(user.userId);

    return ResponseEntity.CREATED_WITH_DATA(resume);
  }

  // ✅ 자기소개서 삭제 API
  @Route({
    request: {
      path: ':resumeId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
      description: DeleteResumeResponseDescriptionMd,
      type: String,
    },
    summary: DeleteResumeSummaryMd,
    description: DeleteResumeDescriptionMd,
  })
  @ApiParam({
    name: 'resumeId',
    description: '자기소개서 id를 입력해주세요.',
    example: 1234,
    type: Number,
  })
  async deleteResume(@Param('resumeId', ParseIntPipe) resumeId: number, @User() user: UserJwtToken): Promise<ResponseEntity<string>> {
    await this.resumesService.deleteResume({ resumeId, userId: user.userId });

    return ResponseEntity.OK_WITH_MESSAGE('Resume deleted');
  }

  @Route({
    request: {
      path: ':resumeId',
      method: Method.PATCH,
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '자기소개서 제목 수정 API',
    description:
      '# 자기소개서 제목 수정 API\n## Description\n미트볼 버튼을 눌러서 자기소개서 폴더를 수정합니다.\n## etc.\n⛳️ [폴더 이름 미트볼 클릭](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-10307&t=PibZzDLncZrUbrLe-4)',
  })
  @ApiParam({
    name: 'resumeId',
    description: '자기소개서 id를 입력해주세요.',
    example: 1234,
    type: Number,
  })
  async updateResumeFolder(
    @Param('resumeId', ParseIntPipe) resumeId: number,
    @User() user: UserJwtToken,
    @Body() patchResumeRequestDto: PatchResumeRequestDto,
  ): Promise<ResponseEntity<string>> {
    await this.resumesService.updateResumeFolder(patchResumeRequestDto, resumeId, user.userId);

    return ResponseEntity.OK_WITH_MESSAGE('Resume updated');
  }
}
