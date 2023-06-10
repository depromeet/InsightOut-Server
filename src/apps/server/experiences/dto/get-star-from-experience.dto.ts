import { ApiProperty } from '@nestjs/swagger';
import { Experience } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class GetStarFromExperienceRequestParamDto {
  @ApiProperty({
    description: '경험 카드 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  experienceId: number;
}
