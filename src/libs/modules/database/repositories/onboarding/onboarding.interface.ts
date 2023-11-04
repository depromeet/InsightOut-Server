export interface OnboardingRepository {
  findFirst;
  update;
}

export const OnboardingRepository = Symbol('OnboardingRepository');
