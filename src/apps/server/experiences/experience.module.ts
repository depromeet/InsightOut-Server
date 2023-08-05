import { Module } from '@nestjs/common';

import { ExperienceKeywordController } from '@apps/server/experiences/controllers/experienceCapability.controller';
import { experienceProviders } from '@apps/server/experiences/providers/experience.provider';
import { ExperienceCapabilityService } from '@apps/server/experiences/services/experienceCapability.service';

import { ExperienceController } from './controllers/experience.controller';
import { ExperienceService } from './services/experience.service';

@Module({
  controllers: [ExperienceController, ExperienceKeywordController],
  providers: [ExperienceService, ExperienceCapabilityService, ...experienceProviders],
  exports: [ExperienceService],
})
export class ExperienceModule {}
