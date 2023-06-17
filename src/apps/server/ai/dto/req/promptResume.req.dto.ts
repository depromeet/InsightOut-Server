import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';
import { ArrayMaxSize, IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class PromptResumeBodyResDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ example: 1, type: Number })
  experienceId: number;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @ApiProperty({ example: [1, 2] })
  capabilityIds: number[];

  @ApiProperty({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsNotEmptyString(0, 100)
  situation: string;

  @ApiProperty({ example: '개발 기간이 짧아서 빠른 기간 내 런칭을 완료해야 했음.' })
  @IsNotEmptyString(0, 100)
  task: string;

  @ApiProperty({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsNotEmptyString(0, 100)
  action: string;

  @ApiProperty({ example: '4개월 만에 출시에 성공하게 됨.' })
  @IsNotEmptyString(0, 100)
  result: string;
}
