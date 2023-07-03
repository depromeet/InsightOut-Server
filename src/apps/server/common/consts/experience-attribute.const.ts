import { ExperienceSelect } from '../../experiences/interface/experience-select.interface';

export const getExperienceAttribute: ExperienceSelect = {
  id: true,
  title: true,
  startDate: true,
  endDate: true,
  experienceStatus: true,
  // situation: true,
  // task: true,
  // action: true,
  // result: true,
  ExperienceInfo: {
    select: {
      experienceId: true,
      id: true,
      experienceRole: true,
      motivation: true,
      utilization: true,
      analysis: true,
    },
  },
  AiResume: { select: { AiResumeCapability: true } },
} as const;
