export interface ExperienceSelect {
  id?: boolean;
  title?: boolean;
  startDate?: boolean;
  endDate?: boolean;
  experienceStatus?: boolean;
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
          createdAt?: boolean;
          updatedAt?: boolean;
          experienceId?: boolean;
        };
      };
}
