import { Body, Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from '../services/resumes.service';
import { User } from '../../decorators/request/user.decorator';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Route } from '../../decorators/router/route.decorator';
import { PostResumeRequestBodyDto } from '../dtos/post-resume.dto';
import { ResponseEntity } from '📚libs/utils/respone.entity';
import { Method } from '📚libs/enums/method.enum';

@ApiTags('resumes')
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiOperation({
    summary: '자기소개서를 조회',
    description:
      '자기소개서를 처음 조회했을 때, 자기소개서 폴더링 목록과 각 폴더링 별 문항을 모두 출력합니다.',
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
  async createResumeFolder(
    @Body() postResumeRequestBodyDto: PostResumeRequestBodyDto,
    @User() user: UserJwtToken,
  ) {
    const resume = await this.resumesService.createResumeFolder(
      postResumeRequestBodyDto,
      user.userId,
    );

    return ResponseEntity.CREATED_WITH_DATA(resume);
  }
}
