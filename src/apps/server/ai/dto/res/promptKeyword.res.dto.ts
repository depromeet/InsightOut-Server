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
  @Exclude() _capabilities: Capability[];

  constructor(capabilities: Capability[]) {
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
  get capabilities(): Capability[] {
    return this._capabilities;
  }
}
