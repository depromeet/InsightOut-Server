import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class PatchResumeBodyRequestDto {
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;
}

export class PatchResumeRequestParamDto {
  @ApiProperty({
    description: '업데이트할 자기소개서 id입니다.',
    example: '디프만 13기 백엔드 엔지니어',
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  resumeId: number;
}
