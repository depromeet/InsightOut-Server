import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question, Resume } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class GetOneResumeRequestParamDto {
  @ApiProperty({
    description: '자기소개서 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  resumeId: number;
}

export class GetAllResumeRequestQueryDto {
  @ApiPropertyOptional({
    description: '자기소개서 문항 조회 유무. false를 입력 시 자기소개서만 조회하고, true를 입력 시 문항도 함께 조회합니다.',
    example: false,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  answer = false;
}

export class QuestionResponse {
  @Exclude() private _id: number;
  @Exclude() private _title: string;
  @Exclude() private _updatedAt: Date;

  @ApiProperty({
    description: '자기소개서 문항 id',
    type: Number,
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 제목',
    type: String,
    example: '디프만 13기 지원동기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 최종 작성일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this._updatedAt = value;
  }
}

export class QuestionWithAnswerResponse {
  @Exclude() private _id: number;
  @Exclude() private _title: string;
  @Exclude() private _answer: string;
  @Exclude() private _updatedAt: Date;

  @ApiProperty({
    description: '자기소개서 문항 id',
    type: Number,
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 제목',
    type: String,
    example: '디프만 13기 지원동기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  @ApiPropertyOptional({
    description: '자기소개서 문항 답안',
    type: String,
    example: '디프만을 통한 빠른 성장',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  get answer(): string {
    return this._answer;
  }

  set answer(value) {
    this._answer = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 최종 작성일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this._updatedAt = value;
  }
}

export class GetOneResumeResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _questions?: Partial<QuestionResponse>[];

  constructor(resume: Resume & { Question: Question[] }) {
    this._id = resume.id;
    this._title = resume.title;
    this._createdAt = resume.createdAt;
    this._updatedAt = resume.updatedAt;
    this._questions = resume.Question.map((question) => {
      const { resumeId, ...rest } = question;
      return rest;
    });
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 id',
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 생성 일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 작성 일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항',
    type: QuestionResponse,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionWithAnswerResponse)
  get questions(): Partial<Question>[] {
    return this._questions;
  }
}

export class GetOneResumeWithAnswerResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _questions?: Partial<QuestionWithAnswerResponse>[];

  constructor(resume: Resume & { Question: Question[] }) {
    this._id = resume.id;
    this._title = resume.title;
    this._createdAt = resume.createdAt;
    this._updatedAt = resume.updatedAt;
    this._questions = resume.Question.map((question) => {
      const { resumeId, ...rest } = question;
      return rest;
    });
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 id',
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 생성 일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 작성 일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 문항',
    type: QuestionWithAnswerResponse,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionWithAnswerResponse)
  get questions(): Partial<Question>[] {
    return this._questions;
  }
}

export class GetOneResumeWithTitleResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  constructor(resume: Resume) {
    this._id = resume.id;
    this._title = resume.title;
    this._createdAt = resume.createdAt;
    this._updatedAt = resume.updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 id',
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 생성 일자',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 작성 일자',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
