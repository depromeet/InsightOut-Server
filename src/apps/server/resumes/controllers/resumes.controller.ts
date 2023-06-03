import { UseGuards, Controller, Query, HttpStatus, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Method } from '📚libs/enums/method.enum';
import { SpellCheckResult } from '📚libs/modules/api/api.type';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { GetResumeRequestQueryDto, GetResumeResponseDto } from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeRequestBodyDto, PostResumeResponseDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';
import { ResumesService } from '🔥apps/server/resumes/services/resumes.service';

@ApiTags('resumes')
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Route({
    request: {
      path: '',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetResumeResponseDto,
      isArray: true,
    },
    summary: '자기소개서 조회 API (2023.6.3. Updated)',
    description: `# 자기소개서 조회 API\n## Description\n자기소개서를 조회합니다., 자기소개서 목록과 각 자기소개서 별 문항을 모두 출력합니다.   \n문항에 대한 답안이 payload가 크기 때문에 기본적으로 문항 제목만 조회하며, answer 쿼리스트링 값에 따라서 문항에 대한 답안도 추가적으로 가져옵니다.   \n\`\`\`ts\nconsole.log('hello world!')\n\`\`\`  \n## Keyword\n용어가 통일되지 않아 명세합니다.\n1. 자기소개서: 디프만 13기\n2. 문항: 디프만 13기 지원 동기   \n## etc.\n⛳️[자기소개서 작성 첫 화면](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=bY8GHCeIQEeC8L6e-4)
      `,
  })
  @ApiQuery({
    description: '자기소개서를 조회할 때 사용할 쿼리입니다. false를 입력 시 자기소개서만 조회하고, true를 입력 시 문항도 함께 조회합니다.',
    type: GetResumeRequestQueryDto,
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
      description: '자기소개서 추가에 성공했습니다.',
      type: PostResumeResponseDto,
    },
    summary: '자기소개서 추가 API',
    description:
      '# 자기소개서 추가 API\n## Description\n새로 추가 버튼을 눌러 자기소개서를 추가합니다.\n## etc.\n⛳️[새 폴더 추가한 경우](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8662&t=zKwSWoPmdDHGzQV4-4)',
  })
  async createResumeFolder(
    @Body() postResumeRequestBodyDto: PostResumeRequestBodyDto,
    @User() user: UserJwtToken,
  ): Promise<ResponseEntity<PostResumeResponseDto>> {
    const resume = await this.resumesService.createResumeFolder(postResumeRequestBodyDto, user.userId);

    return ResponseEntity.CREATED_WITH_DATA(resume);
  }

  @Route({
    request: {
      path: 'spell-check',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.OK,
      description: '자기소개서 맞춤법 검사에 성공했습니다. 다음 맞춤법 검사의 결과입니다.',
      type: SpellCheckResult,
      isArray: true,
    },
    summary: '자기소개서 답안 맞춤법 검사 API',
    description:
      '# 자기소개서 답안 맞춤법 검사 API\n## Description\n맞춤법을 검사하여 맞춤법에 맞지 않은 토큰을 모두 반환합니다.\n## etc.\n⛳️ [맞춤법 검사-로딩...](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-19185&t=zKwSWoPmdDHGzQV4-4)   \n⛳️ [맞춤법 검사-오류 없음](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-19553&t=zKwSWoPmdDHGzQV4-4)   \n⛳️ [맞춤법 검사 - 오류 있음](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-11498&t=zKwSWoPmdDHGzQV4-4)   \n⛳️ [맞춤법 검사-오류 보기](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-20990&t=zKwSWoPmdDHGzQV4-4)',
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
    summary: '자기소개서 삭제 API',
    description:
      '# 자기소개서 삭제 API\n## Description\n자기소개서 폴더를 삭제합니다. 폴더 하위에 있는 문항도 같이 삭제됩니다.\n## etc.\n⛳️ [폴더 이름 미트볼 클릭](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-10307&t=PibZzDLncZrUbrLe-4)',
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
