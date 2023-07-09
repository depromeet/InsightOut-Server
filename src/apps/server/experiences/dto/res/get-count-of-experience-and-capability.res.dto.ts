import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsPositive, IsNotEmpty, Min } from 'class-validator';
import { CountExperienceAndCapability } from '🔥apps/server/experiences/types/count-experience-and-capability.type';

export class GetCountOfExperienceAndCapabilityResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _keyword: string;
  @Exclude() private readonly _count: number;

  constructor(capabilityAndCount: CountExperienceAndCapability) {
    this._id = capabilityAndCount.id;
    this._keyword = capabilityAndCount.keyword;
    this._count = capabilityAndCount._count.ExperienceCapability;
  }

  @Expose()
  @ApiProperty({
    description: '역량 키워드 키워드입니다. 완료여부(isCompleted 쿼리)에 따라 완료된 것 또는 모든 키워드를 반환합니다.',
    example: '추진력',
    type: String,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get keyword(): string {
    return this._keyword;
  }

  @Expose()
  @ApiProperty({
    description: '역량 키워드 id입니다. 해당 id를 통해서 이 키워드를 사용하는 모든 경험카드(experience)를 가져옵니다.',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '역량 키워드 개수입니다.',
    example: 100,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @Min(0)
  get count(): number {
    return this._count;
  }
}

export class GetCountOfExperienceResponseDto {
  @Exclude() private readonly _experience: number;

  constructor(countOfExperience: number) {
    this._experience = countOfExperience;
  }

  @Expose()
  @ApiProperty({
    description: '생성된 경험 카드 개수입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @Min(1)
  get experience(): number {
    return this._experience;
  }
}
