import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class PatchQuestionRequestParamDto {
  @ApiProperty({
    description: '자기소개서 문항 id',
    example: 1234,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  questionId: number;
}

export class PatchQuestionRequestBodyDto {
  @ApiPropertyOptional({
    description: '자기소개서 문항 제목',
    example: '디프만 13기 지원동기',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(300)
  title?: string | undefined;

  @ApiPropertyOptional({
    description: '자기소개서 문항 답안',
    example: '개발자로 성장하기 위해서 지원함',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(2500)
  answer?: string | undefined;
}

export class PatchQuestionResponseDto {
  @Exclude() private readonly _updatedAt: Date;

  constructor(question: Question) {
    this._updatedAt = question.updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 수정 일자입니다. UTC 날짜를 반환합니다.',
    example: new Date(),
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
