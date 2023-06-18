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

export class PromptKeywordResDto {
  @Exclude() _capabilities: Omit<Capability, 'userId' | 'keywordType'>[];

  constructor(capabilities: Omit<Capability, 'userId' | 'keywordType'>[]) {
    this._capabilities = capabilities;
  }

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => Keyword)
  @ApiProperty({
    example: [
      { id: 1, keyword: '협업' },
      { id: 1, keyword: '리더십' },
    ],
  })
  get capabilities(): Omit<Capability, 'userId' | 'keywordType'>[] {
    return this._capabilities;
  }
}

export class PromptResumeConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;
  @ApiProperty({ example: 'ConflictException' })
  title: string;
  @ApiProperty({
    example: '이미 ai Capability가 존재합니다.',
  })
  message: string;
}
