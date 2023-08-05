import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAiResumeQueryRequestDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '추진력' })
  aiKeyword?: string;
}
