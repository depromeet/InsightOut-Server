import { KeywordType } from '@prisma/client';

export type ExperienceCardType = {
  title: string;
  summaryKeywords: string[];
  ExperienceInfo: { analysis: string };
  ExperienceCapability: { Capability: { keyword: string; keywordType: KeywordType } }[];
  AiRecommendQuestion: { id: number; title: string }[];
  AiResume: { content: string; AiResumeCapability: { Capability: { keyword: string; keywordType: KeywordType } }[] };
};
