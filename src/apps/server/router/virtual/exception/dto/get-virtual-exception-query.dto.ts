import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, MinLength } from 'class-validator';

export class GetVirtualExceptionQueryDto {
  @ApiPropertyOptional({ description: '양의 정수값', default: 0 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  positiveInt: number;

  @ApiPropertyOptional({ description: '양의 정수값', default: '' })
  @IsOptional()
  @MinLength(4, { message: '최소 4글자 이상' })
  min4Length: string;
}
