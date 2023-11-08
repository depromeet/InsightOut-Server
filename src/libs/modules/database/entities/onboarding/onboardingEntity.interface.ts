import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface OnboardingEntity {
  userId: number;

  field: boolean;
  experience: boolean;
  experienceStepper: boolean;
  resume: boolean;
  collection: boolean;

  User: UserEntity;
}
