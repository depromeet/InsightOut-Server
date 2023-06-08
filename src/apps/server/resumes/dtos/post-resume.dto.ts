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
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  // Entity -> DTO
  constructor(resume: Resume) {
    this._id = resume.id;
    this._createdAt = resume.createdAt;
    this._updatedAt = resume.updatedAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 id입니다. 각 자기소개서 별로 고유한 key 값으로 사용가능합니다.',
    example: 1234,
  })
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 생성일자입니다. Date 객체 값이 전달됩니다.',
    example: new Date(),
    type: Date,
  })
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 수정일자입니다. Date 객체 값이 전달됩니다.',
    example: new Date(),
    type: Date,
  })
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
