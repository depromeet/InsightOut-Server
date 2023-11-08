import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { OnboardingEntity } from '@libs/modules/database/entities/onboarding/onboardingEntity.interface';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export class Onboarding extends BaseTimeEntity implements OnboardingEntity {
  userId: number;
  field: boolean;
  experience: boolean;
  experienceStepper: boolean;
  resume: boolean;
  collection: boolean;

  // Relationship
  User: UserEntity;
}
