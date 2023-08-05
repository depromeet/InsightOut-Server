import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class PostIssueTestTokenBodyRequestDto {
  @ApiProperty({
    description: '유저 고유 식별 id',
    type: Number,
    example: 1234,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
