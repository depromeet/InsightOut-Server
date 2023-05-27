import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '../../../libs/utils/respone.entity';
import { PostResumeRequestBodyDto } from './dtos/post-resume.dto';
import { PatchResumeRequestDto } from './dtos/patch-resume.dto';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';
import { User } from '🔥apps/server/common/decorators/request/user.decorator';
import { Route } from '🔥apps/server/common/decorators/router/route.decorator';
import { Method } from '📚libs/enums/method.enum';

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
  async getAllResumes(@User() user: UserJwtToken) {
    const resumes = await this.resumesService.getAllResumes(user.userId);

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
