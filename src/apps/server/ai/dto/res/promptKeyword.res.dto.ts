import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Capability } from '@prisma/client';

class Keyword {
  @IsNumber()
  id: number;
  @IsString()
  keyword: string;
}

// AI 키워드 응답
export class PromptKeywordResDto {
  @Exclude() _capabilities: Omit<Capability, 'userId' | 'keywordType' | 'experienceId'>[];

  constructor(capabilities: Omit<Capability, 'userId' | 'keywordType' | 'experienceId'>[]) {
    this._capabilities = capabilities;
  }

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => Keyword)
  @ApiProperty({
    description: 'ai 역량 키워드 리스트',
    example: [
      { id: 1, keyword: '협업' },
      { id: 1, keyword: '리더십' },
    ],
  })
  get capabilities(): Omit<Capability, 'userId' | 'keywordType' | 'experienceId'>[] {
    return this._capabilities;
  }
}

export class PromptResumeKeywordsConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;
  @ApiProperty({ example: 'ConflictException' })
  title: string;
  @ApiProperty({
    example: '이미 ai Capability가 존재합니다.',
  })
  message: string;
}
