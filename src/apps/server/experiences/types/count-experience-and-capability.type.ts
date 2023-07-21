import { AiRecommendQuestion, AiResume, Experience, ExperienceCapability, ExperienceInfo } from '@prisma/client';

export class CountExperienceAndCapability {
  id: number;
  keyword: string;
  _count: {
    ExperienceCapabilities: number;
  };
  ExperienceCapabilities: {
    experienceId: number;
    capabilityId: number;
    Experience: Partial<Experience> & {
      ExperienceInfo: Partial<ExperienceInfo>;
      AiResume: Partial<AiResume>;
      ExperienceCapabilities: Partial<ExperienceCapability>[];
      AiRecommendQuestions: Partial<AiRecommendQuestion>[];
    };
  }[];
}
