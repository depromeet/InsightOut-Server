import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { CountExperienceAndCapability } from '🔥apps/server/collections/types/count-experience-and-capability.type';

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
    description: '역량 키워드 id입니다. 해당 id를 통해서 이 키워드를 사용하는 모든 경험카드(experience)를 가져옵니다.',
    example: 1234,
    type: Number,
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
    example: 1234,
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
    description: '역량 키워드 id입니다. 해당 id를 통해서 이 키워드를 사용하는 모든 경험카드(experience)를 가져옵니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @Min(0)
  get count(): number {
    return this._count;
  }
}
