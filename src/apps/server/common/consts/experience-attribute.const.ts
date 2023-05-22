import { ExperienceSelect } from '../../experience/interface/experience-select.interface';

export const getExperienceAttribute: ExperienceSelect = {
  title: true,
  startDate: true,
  endDate: true,
  experienceStatus: true,
  ExperienceInfo: {
    select: {
      experienceInfoId: true,
      experienceRole: true,
      motivate: true,
    },
  },
} as const;
