import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAiResumeCountDto {
  @Exclude() _count: number;

  constructor(count: number) {
    this._count = count;
  }
  @IsNotEmpty()
  @IsInt()
  @Expose()
  @ApiProperty({ example: 1 })
  get count(): number {
    return this._count;
  }
}
