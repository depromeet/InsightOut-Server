import { ExperienceStatus } from '@prisma/client';

import { AiRecommendQuestionResponseDto, AiResumeResDto } from '@apps/server/experiences/dto/res/getExperienceCardInfo.dto';

export type ExperienceCardType = {
  title: string;
  startDate: Date;
  endDate: Date;
  situation: string;
  task: string;
  action: string;
  result: string;
  experienceStatus: ExperienceStatus;
  summaryKeywords: string[];
  ExperienceInfo: { analysis: string };
  ExperienceCapability: string[];
  AiRecommendQuestion: AiRecommendQuestionResponseDto[];
  AiResume: AiResumeResDto;
};
