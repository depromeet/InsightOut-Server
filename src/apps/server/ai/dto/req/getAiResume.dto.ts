import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAiResumeQueryRequestDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '추진력' })
  aiKeyword?: string;
}
