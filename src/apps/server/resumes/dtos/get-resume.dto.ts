import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question, Resume } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
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

export class GetResumeResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _question?: Partial<Question>[] | undefined;

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
  })
  get question(): Partial<Question>[] | undefined {
    return this._question;
  }
}
