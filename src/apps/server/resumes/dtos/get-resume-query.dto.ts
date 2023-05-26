import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetResumeRequestQueryDto {
  @ApiPropertyOptional({
    description: '필터링할 폴더 제목',
    example: '디프만 자기소개서',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  filter?: string | undefined;

  @ApiPropertyOptional({
    description:
      '자기소개서 문항 조회 유무. false를 입력 시 자기소개서만 조회하고, true를 입력 시 문항도 함께 조회합니다.',
    example: false,
  })
  @IsBooleanString()
  @IsOptional()
  question = false;
}
