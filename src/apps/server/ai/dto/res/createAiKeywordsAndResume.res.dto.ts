import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateAiKeywordsAndResumeResDto {
  @Exclude() _content: string;
  @Exclude() _keywords: string[];

  constructor(data: { content: string; keywords: string[] }) {
    this._content = data.content;
    this._keywords = data.keywords;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Max(700)
  @Min(0)
  @ApiProperty({ example: '저는 UI/UX 직무에 지원하는 .....', type: String })
  get content(): string {
    return this._content;
  }

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(0)
  @IsNotEmpty()
  @ApiProperty({ example: ['협동력', '창의력'], type: Array })
  get keyword(): string[] {
    return this._keywords;
  }
}

export class CreateAiKeywordsAndResumeBadRequestErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: 'AI 생성하는 데 실패했습니다. 타입을 확인해주세요',
  })
  message: string;
}

export class CreateAiKeywordsAndResumeConfiltErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: '이미 해당 AI 추천 자기소개서가 존재합니다.',
  })
  message: string;
}
