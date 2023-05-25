import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchQuestionRequestBodyDto {
  @ApiPropertyOptional({
    description: '자기소개서 문항 제목',
    example: '디프만 13기 지원동기',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string | undefined;

  @ApiPropertyOptional({
    description: '자기소개서 문항 답안',
    example: '개발자로 성장하기 위해서 지원함',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(2000)
  answer?: string | undefined;
}
