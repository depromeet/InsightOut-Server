import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PostAiResumeRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '경험을 수행하게 된 계기나 이유', type: String })
  situation: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '경험을 수행하면서 설정한 목표', type: String })
  task: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '경험을 수행하면서 했던 행동', type: String })
  action: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '경험을 수행한 후의 결과', type: String })
  result: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ example: ['리더십', '기획력'], description: '추천 자기소개서 프롬프트를 진행할 때 필요한 역량 키워드들입니다.' })
  capabilities: string[];
}
