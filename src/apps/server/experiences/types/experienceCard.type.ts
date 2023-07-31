import { AiRecommendQuestionResDto, AiResumeResDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.dto';
import { ExperienceStatus } from '@prisma/client';

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
  AiRecommendQuestion: AiRecommendQuestionResDto[];
  AiResume: AiResumeResDto;
};
