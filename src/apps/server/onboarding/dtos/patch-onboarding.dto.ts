import { ApiPropertyOptional } from '@nestjs/swagger';
import { Onboarding } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class PatchOnboardingRequestBodyDto {
  @ApiPropertyOptional({
    description: '경험분해 온보딩 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  experience?: boolean;

  // 곧 삭제될 툴팁
  @ApiPropertyOptional({
    description: '경험분해 스텝퍼에 사용되는 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  experienceStepper?: boolean;

  @ApiPropertyOptional({
    description: '자기소개서 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  resume?: boolean;

  @ApiPropertyOptional({
    description: '모아보기 정렬 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  collection?: boolean;
}

export class PatchOnboardingResponseDto {
  @Exclude() private readonly _experience?: boolean | undefined;
  @Exclude() private readonly _experienceStepper?: boolean | undefined;
  @Exclude() private readonly _resume?: boolean | undefined;
  @Exclude() private readonly _collection?: boolean | undefined;

  constructor(onboarding: Onboarding) {
    this._experience = onboarding.experience;
    this._experienceStepper = onboarding.experienceStepper;
    this._resume = onboarding.resume;
    this._collection = onboarding.collection;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험분해 온보딩 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  get experience(): boolean {
    return this._experience;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험분해 스텝퍼에 사용되는 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  get experienceStepper(): boolean {
    return this._experienceStepper;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '자기소개서 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  get resume(): boolean {
    return this._resume;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '모아보기 정렬 툴팁 경험 여부',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  get collection(): boolean {
    return this._collection;
  }
}
