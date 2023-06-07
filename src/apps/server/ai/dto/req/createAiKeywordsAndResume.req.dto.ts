import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateAiKeywordsAndResumeBodyReqDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ example: 1, type: Number })
  experienceId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(0)
  @IsNotEmpty()
  @ApiProperty({ example: ['협동력', '창의력'], type: Array })
  keywords: string[];

  @IsString()
  @MaxLength(700)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({ example: '저는 UI/UX 직무에 지원하는 .....', type: String })
  content: string;
}
