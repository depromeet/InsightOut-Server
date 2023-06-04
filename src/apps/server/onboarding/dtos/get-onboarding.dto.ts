import { ApiProperty } from '@nestjs/swagger';
import { Onboarding } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class GetAllOnboardingsResponseDto {
  @Exclude() private readonly _experience: boolean;
  @Exclude() private readonly _experienceStepper: boolean;
  @Exclude() private readonly _resume: boolean;
  @Exclude() private readonly _collection: boolean;

  constructor(onboarding: Onboarding) {
    this._experience = onboarding.experience;
    this._experienceStepper = onboarding.experienceStepper;
    this._resume = onboarding.resume;
    this._collection = onboarding.collection;
  }

  @Expose()
  @ApiProperty()
  get experience(): boolean {
    return this._experience;
  }

  @Expose()
  @ApiProperty()
  get experienceStepper(): boolean {
    return this._experienceStepper;
  }

  @Expose()
  @ApiProperty()
  get resume(): boolean {
    return this._resume;
  }

  @Expose()
  @ApiProperty()
  get collection(): boolean {
    return this._collection;
  }
}
