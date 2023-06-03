import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class GetOneQuestionRequestParamDto {
  @ApiProperty({
    description: '자기소개서 문항 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  questionId: number;
}

export class GetOneQuestionResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title?: string | undefined;
  @Exclude() private readonly _answer?: string | undefined;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  constructor(question: Question) {
    this._id = question.id;
    this._title = question.title;
    this._answer = question.answer;
    this._createdAt = question.createdAt;
    this._updatedAt = question.updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '자기소개서 문항 제목',
    example: 'IT 업계에서 많은 개발자와 디자이너가 있는데, 지원자분들 뽑아야 하는 이유가 무엇이 있을까요?',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(300)
  get title(): string | undefined {
    return this._title;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '자기소개서 문항 답안',
    example: '그야 나는 최고니까.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(2500)
  get answer(): string | undefined {
    return this._answer;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 생성 일자',
    example: new Date(),
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 수정 일자',
    example: new Date(),
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
