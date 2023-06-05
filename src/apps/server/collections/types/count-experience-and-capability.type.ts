import { Capability } from '@prisma/client';

export type CountExperienceAndCapability = Capability & { _count: { ExperienceCapability: number } };
