import { Body, Controller, Get, HttpStatus, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { User } from '../common/decorators/request/user.decorator';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '../../../libs/utils/respone.entity';
import { Method } from '../../../enums/method.enum';
import { PostResumeRequestBodyDto } from './dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from './dtos/post-spell-check-request.body.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Route } from '../common/decorators/router/route.decorator';

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
}
