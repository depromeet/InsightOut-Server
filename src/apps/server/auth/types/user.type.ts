import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UserSigninResult {
  @ApiProperty({
    description: '유저 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: '유저 온보딩 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  hasWrittenResume: boolean;
}
