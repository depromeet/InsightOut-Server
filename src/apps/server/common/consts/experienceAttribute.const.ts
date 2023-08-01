import { ExperienceSelect } from '🔥apps/server/experiences/interfaces/experienceSelect.interface';

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
      analysis: true,
    },
  },
  AiResume: { select: { AiResumeCapabilities: true } },
} as const;
