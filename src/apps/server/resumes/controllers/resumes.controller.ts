import { UseGuards, Controller, Get, Query, HttpStatus, Body, HttpCode, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { GetResumeRequestQueryDto, GetResumeResponseDto } from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeRequestBodyDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';
import { ResumesService } from '🔥apps/server/resumes/services/resumes.service';

@ApiTags('resumes')
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiOperation({
    summary: '자기소개서를 조회',
    description: '자기소개서를 처음 조회했을 때, 자기소개서 폴더링 목록과 각 폴더링 별 문항을 모두 출력합니다.',
  })
  async getAllResumes(
    @User() user: UserJwtToken,
    @Query() query: GetResumeRequestQueryDto,
  ): Promise<ResponseEntity<GetResumeResponseDto[]>> {
    const resumes = await this.resumesService.getAllResumes(user.userId, query);

    return ResponseEntity.OK_WITH_DATA(resumes);
  }

  @Route({
    request: {
      path: '',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
    },
    summary: '자기소개서 폴더 추가 API',
    description: '새로 추가 버튼을 눌러 자기소개서 폴더를 추가합니다.',
  })
  async createResumeFolder(@Body() postResumeRequestBodyDto: PostResumeRequestBodyDto, @User() user: UserJwtToken) {
    const resume = await this.resumesService.createResumeFolder(postResumeRequestBodyDto, user.userId);

    return ResponseEntity.CREATED_WITH_DATA(resume);
  }

  @HttpCode(200)
  @Post('spell-check')
  @ApiOperation({
    summary: '맞춤법 검사',
    description: '맞춤법을 검사하여, 맞춤법 오류의 타입과 해당 글자, 교정 방법과 맞춤법이 틀린 이유를 반환합니다.',
  })
  @ApiOkResponse({
    description: '맞춤법 조회 결과를 반환합니다.',
  })
  async spellCheck(@Body() body: PostSpellCheckRequestBodyDto) {
    const checkedSpell = await this.resumesService.spellCheck(body);

    return ResponseEntity.OK_WITH_DATA(checkedSpell);
  }

  @Route({
    request: {
      path: ':resumeId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '자기소개서 폴더 삭제 API',
    description: '자기소개서 폴더를 삭제합니다. 폴더 하위에 있는 문항도 같이 삭제됩니다.',
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
    summary: '자기소개서 폴더 수정 API',
    description: '미트볼 버튼을 눌러서 자기소개서 폴더를 수정합니다.',
  })
  async updateResumeFolder(
    @Param('resumeId', ParseIntPipe) resumeId: number,
    @User() user: UserJwtToken,
    @Body() body: PatchResumeRequestDto,
  ): Promise<ResponseEntity<string>> {
    await this.resumesService.updateResumeFolder({
      body,
      resumeId,
      userId: user.userId,
    });

    return ResponseEntity.OK_WITH_MESSAGE('Resume updated');
  }
}
