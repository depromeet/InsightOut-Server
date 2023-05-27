import { ApiProperty } from '@nestjs/swagger';
import { Question } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class PostQuestionRequestParamDto {
  @ApiProperty({
    description: '자기소개서 id',
    example: 123,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  resumeId: number;
}

export class PostQuestionResponseDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _resumeId: number;
  @Exclude() readonly _title: string;
  @Exclude() readonly _createdAt: Date;
  @Exclude() readonly _updatedAt: Date;

  constructor(question: Question) {
    this._id = question.id;
    this._resumeId = question.resumeId;
    this._title = question.title;
    this._createdAt = question.createdAt;
    this._updatedAt = question.updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 id',
    example: 1234,
  })
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 id',
    example: 1234,
  })
  get resumeId(): number {
    return this._resumeId;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 제목',
    example: '디프만 13기 지원동기',
  })
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 생성일자',
    example: new Date(),
  })
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항 작성일자(수정일자)',
    example: new Date(),
  })
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
