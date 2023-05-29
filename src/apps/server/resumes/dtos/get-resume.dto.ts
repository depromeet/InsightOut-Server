import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question, Resume } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetResumeRequestQueryDto {
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
  question = false;
}

class QuestionResponse {
  #id: number;
  #title: string;
  #answer: string;
  #updatedAt: Date;

  @ApiProperty({
    description: '자기소개서 문항 id',
    type: Number,
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 제목',
    type: String,
    example: '디프만 13기 지원동기',
  })
  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this.#title;
  }

  set title(value) {
    this.#title = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 답안',
    type: String,
    example: '디프만을 통한 빠른 성장',
  })
  @IsString()
  @IsNotEmpty()
  get answer(): string {
    return this.#answer;
  }

  set answer(value) {
    this.#answer = value;
  }

  @ApiProperty({
    description: '자기소개서 문항 최종 작성일자',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  get updatedAt() {
    return this.#updatedAt;
  }

  set updatedAt(value) {
    this.#updatedAt = value;
  }
}

export class GetResumeResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _question?: Partial<QuestionResponse>[] | undefined;

  constructor(resume: Resume & { Question?: Question[] | undefined }) {
    this._id = resume.id;
    this._title = resume.title;
    this._updatedAt = resume.updatedAt;
    if (resume.Question) {
      this._question = resume.Question.map((question) => {
        const { resumeId, createdAt, ...rest } = question;
        return rest;
      });
    }
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 id',
    example: 1234,
  })
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
  })
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 작성 일자',
    example: new Date(),
  })
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '자기소개서 문항',
    type: QuestionResponse,
  })
  get question(): Partial<Question>[] | undefined {
    return this._question;
  }
}
