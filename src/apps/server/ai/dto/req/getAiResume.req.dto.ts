import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAiResumeQueryReqDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '추진력' })
  aiKeyword?: string;
}
