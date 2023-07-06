export interface ExperienceSelect {
  id?: boolean;
  title?: boolean;
  startDate?: boolean;
  endDate?: boolean;
  experienceStatus?: boolean;
  situation?: boolean;
  task?: boolean;
  action?: boolean;
  result?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  userId?: boolean;
  ExperienceInfo?:
    | boolean
    | {
        select?: {
          id?: boolean;
          experienceRole?: boolean;
          motivation?: boolean;
          analysis?: boolean;
          createdAt?: boolean;
          updatedAt?: boolean;
          experienceId?: boolean;
        };
      };
  AiResume: { select: { AiResumeCapability: true } };
}
