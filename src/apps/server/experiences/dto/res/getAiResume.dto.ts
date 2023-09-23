import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetAiResumeResponseDto {
  @Exclude() _content: string;
  @Exclude() _id: number;

  constructor(data: { id: number; content: string }) {
    this._content = data.content;
    this._id = data.id;
  }

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({
    example: `저는 협업능력과 빠른 적응력을 보유한 개발자입니다. 이러한 역량은 저의 경력과 교육, 동아리 경험에서 쌓아왔습니다.\\n\\n제가 속한 IT 동아리에서는 개발자와 함께 팀을 이루어 프로젝트를 진행하였습니다. 그 중에서도 개발 기간이 짧아서 빠른 기간 내 런칭을 완료해야 하는 과제가 있었습니다. 이를 위해 저는 개인적으로 코딩 능력을 향상시키고, 팀원들과의 소통을 반복해 문제를 해결하였습니다.\\n\\n이렇게 빠르게 적응한 결과, 4개월 만에 런칭에 성공하였습니다. 이 경험이 저에게는 큰 자신감을 주었으며, 협업 능력을 향상시키는 계기가 되었습니다. 또한, 이 경험으로 인해 불안한 상황에서도 빠르게 대처할 수 있는 능력이 향상되었습니다.\\n\\n이러한 경험을 바탕으로, 저는 이 회사에서도 협업 능력을 더욱 향상시키고, 빠른 적응력을 바탕으로 빠르게 성과를 내고자 합니다. 이를 위해 끊임없이 노력하고, 팀원들과의 소통을 통해 문제를 해결하며 일하는 모습을 보일 것입니다.`,
    description: 'AI가 추천해준 자기소개서 내역입니다.',
  })
  get content(): string {
    return this._content;
  }

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({ example: 1, description: 'aiResume의 아이디 값입니다.' })
  get id(): number {
    return this._id;
  }
}

export class GetAiResumeNotFoundException {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundException' })
  title: string;
  @ApiProperty({
    example: '해당 experienceId로 추천된 AI Resuem가 없습니다.',
  })
  message: string;
}
