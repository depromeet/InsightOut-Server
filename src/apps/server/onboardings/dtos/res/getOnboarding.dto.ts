import { ApiProperty } from '@nestjs/swagger';
import { Onboarding } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class GetAllOnboardingsResponseDto {
  @Exclude() private readonly _field: boolean;
  @Exclude() private readonly _experience: boolean;
  @Exclude() private readonly _experienceStepper: boolean;
  @Exclude() private readonly _resume: boolean;
  @Exclude() private readonly _collection: boolean;

  constructor(onboarding: Onboarding) {
    this._field = onboarding.field;
    this._experience = onboarding.experience;
    this._experienceStepper = onboarding.experienceStepper;
    this._resume = onboarding.resume;
    this._collection = onboarding.collection;
  }

  @Expose()
  @ApiProperty({
    description: '직무 선택 온보딩 여부',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  get field(): boolean {
    return this._field;
  }

  @Expose()
  @ApiProperty({
    description: '경험 분해 온보딩 여부',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  get experience(): boolean {
    return this._experience;
  }

  @Expose()
  @ApiProperty({
    description: '경험 분해 스텝퍼 온보딩 여부',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  get experienceStepper(): boolean {
    return this._experienceStepper;
  }

  @Expose()
  @ApiProperty({
    description: '자기소개서 온보딩 여부',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  get resume(): boolean {
    return this._resume;
  }

  @Expose()
  @ApiProperty({
    description: '모아보기 온보딩 여부',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  get collection(): boolean {
    return this._collection;
  }
}
