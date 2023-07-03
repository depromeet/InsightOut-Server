import { AiRecommendQuestionResDto, AiResumeResDto } from '🔥apps/server/experiences/dto/res/getExperienceCardInfo.res.dto';

export type ExperienceCardType = {
  title: string;
  startDate: Date;
  endDate: Date;
  situation: string;
  task: string;
  action: string;
  result: string;
  summaryKeywords: string[];
  ExperienceInfo: { analysis: string };
  ExperienceCapability: string[];
  AiRecommendQuestion: AiRecommendQuestionResDto[];
  AiResume: AiResumeResDto;
};
