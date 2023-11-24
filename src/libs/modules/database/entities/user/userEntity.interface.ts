import { AiResumeEntity } from '@libs/modules/database/entities/aiResume/aiResumeEntity.interface';
import { CapabilityEntity } from '@libs/modules/database/entities/capability/capabilityEntity.interface';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { OnboardingEntity } from '@libs/modules/database/entities/onboarding/onboardingEntity.interface';
import { ResumeEntity } from '@libs/modules/database/entities/resume/resumeEntity.interface';
import { UserInfoEntity } from '@libs/modules/database/entities/userInfo/userInfoEntity.interface';

export interface UserEntity {
  id: number;
  email: string;
  uid: string;
  socialId: string;
  nickname: string;

  // Relationship
  UserInfo: UserInfoEntity;
  Onboarding: OnboardingEntity;
  Resumes: ResumeEntity[];
  AiResumes: AiResumeEntity[];
  Experiences: ExperienceEntity[];
  Capabilities: CapabilityEntity[];
}
