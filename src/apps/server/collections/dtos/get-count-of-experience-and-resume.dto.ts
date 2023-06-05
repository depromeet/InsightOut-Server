import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetCountOfExperienceAndResumeResponseDto {
  @Exclude() private readonly _experience: number;
  @Exclude() private readonly _resume: number;

  constructor(countOfExperience: number, countOfResume: number) {
    this._experience = countOfExperience;
    this._resume = countOfResume;
  }

  @Expose()
  @ApiProperty({
    description: '생성된 경험 카드 개수입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @Min(0)
  get experience(): number {
    return this._experience;
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
