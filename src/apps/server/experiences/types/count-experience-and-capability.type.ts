export class CountExperienceAndCapability {
  id: number;
  keyword: string;
  _count: {
    ExperienceCapabilities: number;
  };
  ExperienceCapabilities: { experienceId: number; capabilityId: number };
}
