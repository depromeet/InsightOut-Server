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
  experienceInfo?:
    | boolean
    | {
        select?: {
          experienceInfoId?: boolean;
          experienceRole?: boolean;
          motivate?: boolean;
          analysis?: boolean;
          utilization?: boolean;
          createdAt?: boolean;
          updatedAt?: boolean;
          experienceId?: boolean;
        };
      };
}
