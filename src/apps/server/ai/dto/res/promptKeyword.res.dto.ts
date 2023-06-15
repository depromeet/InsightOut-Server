import { Exclude, Expose } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromptKeywordResDto {
  @Exclude() _keywords: string[];

  constructor(keywords: string[]) {
    this._keywords = keywords;
  }

  @Expose()
  @IsArray()
  @ArrayMaxSize(2)
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['협업', '린하게 개발'] })
  get keywords(): string[] {
    return this._keywords;
  }
}
