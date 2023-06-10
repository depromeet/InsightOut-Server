import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromptTestBodyReqDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'how can you learn English?' })
  prompt: string;
}
