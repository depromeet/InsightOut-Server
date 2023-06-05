import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsPositive, IsNotEmpty, Min } from 'class-validator';
import { CountExperienceAndCapability } from '🔥apps/server/collections/types/count-experience-and-capability.type';

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
