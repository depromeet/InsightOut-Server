import { KeywordType } from '@prisma/client';

export class CountExperienceAndCapability {
  id: number;
  keyword: string;
  keywordType: KeywordType;
  userId: number;
  _count: {
    ExperienceCapability: number;
  };
}
