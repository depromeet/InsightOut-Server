import { Provider } from '@nestjs/common';

import { AiResumeRepository } from '@libs/modules/database/repositories/aiResume/aiResume.interface';
import { AiResumeRepositoryImpl } from '@libs/modules/database/repositories/aiResume/aiResume.repository';
import { CapabilityRepositoryImpl } from '@libs/modules/database/repositories/capability/capability.repository';

export const aiProviders: Provider[] = [
  {
    provide: AiResumeRepository,
    useClass: AiResumeRepositoryImpl,
  },
  CapabilityRepositoryImpl,
];
