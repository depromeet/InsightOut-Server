import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const example =
  '저는 협업이 중요함을 인지하고, 개발자와 함께 동아리에 들어가 프로젝트를 진행하며 협업 능력을 쌓았습니다. 이제는 이러한 능력을 바탕으로 회사에서도 잘 활용하고 싶습니다.\n\n`린하게 개발`은 제가 현재까지 경험한 프로젝트 중에서도 가장 중요한 프로젝트입니다. 개발 기간이 짧아서 팀원들과 함께 린하게 개발하는 것이 가장 큰 과제였습니다. 저는 이를 해결하기 위해 빠른 의사 결정과 팀원들과의 소통을 중요시했습니다. 회의에서는 각자 아이디어를 내어 논의하는 과정을 거치며 상호간에 소통할 수 있었습니다.\n\n프로젝트가 힘든 상황에서도, 팀원들과 함께 린하게 개발하는 것이 가장 중요하다는 것을 깨달았습니다. 하나의 주제에 대해 토론하며 서로의 의견을 존중하는 것이 좋은 결과를 가져올 수 있다는 것을 배웠습니다.\n\n결과적으로, `린하게 개발` 프로젝트는 4개월 만에 출시에 성공하게 되었습니다. 그 동안 같이 프로젝트를 진행한 팀원들과의 협업 능력이 이루어낸 결과로 생각됩니다. 이 경험을 바탕으로, 협업을 통해 높은 수준의 개발을 이루어내는 것이 목표입니다.';
export class PromptResumeResponseDto {
  @Exclude() _resume: string;

  constructor(resume: string) {
    this._resume = resume;
  }

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example })
  get resume() {
    return this._resume;
  }
}

export class PromptResumeBadRequestErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: 'AI 추천 자기소개서 타입을 확인해주세요',
  })
  message: string;
}

export class PromptResumeNotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundException' })
  title: string;
  @ApiProperty({
    example: '역량 ID들 중 존재하지 않는 것이 있습니다.',
  })
  message: string;
}

export class PromptResumeConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;
  @ApiProperty({ example: 'ConflictException' })
  title: string;
  @ApiProperty({
    example: '해당 experienceId에 추천 AI 자기소개서가 이미 존재합니다.',
  })
  message: string;
}
