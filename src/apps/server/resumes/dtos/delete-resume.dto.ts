import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteResumeRequestParamDto {
  @ApiProperty({
    description: '삭제할 자기소개서 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  resumeId: number;
}
