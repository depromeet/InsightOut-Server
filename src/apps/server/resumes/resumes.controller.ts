import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { User } from '../decorators/request/user.decorator';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ResponseEntity } from '../../../libs/utils/respone.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Route } from '../decorators/router/route.decorator';
import { Method } from '../../../enums/method.enum';
import { PostResumeRequestBodyDto } from './dtos/post-resume.dto';

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

  @Route({
    request: {
      path: ':resumeId',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
    },
    summary: '자기소개서 폴더 삭제 API',
    description:
      '자기소개서 폴더를 삭제합니다. 폴더 하위에 있는 문항도 같이 삭제됩니다.',
  })
  async deleteResume(
    @Param('resumeId', ParseIntPipe) resumeId: number,
    @User() user: UserJwtToken,
  ) {
    await this.resumesService.deleteResume({ resumeId, userId: user.userId });

    return ResponseEntity.OK_WITH_MESSAGE('Resume deleted');
  }
}
