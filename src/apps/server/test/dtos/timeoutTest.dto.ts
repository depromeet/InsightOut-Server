import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class TimeoutTestRequestQueryDto {
  @ApiProperty({
    description: 'timeout을 테스트하기 위한 시간입니다. millisecond 단위로 입력해 주세요. 대기가 완료된 후 200 응답이 전달됩니다.',
    example: 3000,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  time: number;
}
