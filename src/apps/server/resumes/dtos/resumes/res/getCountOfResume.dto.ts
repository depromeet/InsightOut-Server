import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetCountOfResumeResponseDto {
  @Exclude() private readonly _resume: number;

  constructor(countOfResume: number) {
    this._resume = countOfResume;
  }

  @Expose()
  @ApiProperty({
    description: '생성된 자기소개서 개수입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @Min(0)
  get resume(): number {
    return this._resume;
  }
}
