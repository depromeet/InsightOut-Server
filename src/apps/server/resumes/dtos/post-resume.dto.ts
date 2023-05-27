import { ApiProperty } from '@nestjs/swagger';
import { Resume } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PostResumeRequestBodyDto {
  @ApiProperty({
    description: '자기소개서 폴더 제목',
    example: '디프만 13기',
  })
  @IsString()
  title: string;
}

export class PostResumeResponseDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _title: string;
  @Exclude() readonly _createdAt: Date;
  @Exclude() readonly _updatedAt: Date;

  // Entity -> DTO
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
    description: '자기소개서 폴더 생성일자',
    example: new Date(),
  })
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 폴더 수정일자',
    example: new Date(),
  })
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
