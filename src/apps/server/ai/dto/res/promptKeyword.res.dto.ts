import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromptKeywordResDto {
  @Exclude() _keywords: string[];

  constructor(keywords: string[]) {
    this._keywords = keywords;
  }

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['협업', '린하게 개발'] })
  get keywords() {
    return this._keywords;
  }
}
