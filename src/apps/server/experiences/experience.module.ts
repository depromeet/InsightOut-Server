import { Module } from '@nestjs/common';
import { ExperienceController } from './controllers/experience.controller';
import { ExperienceService } from './services/experience.service';
import { experienceProviders } from './provider/experience.provider';
import { ExperienceCapabilityService } from '🔥apps/server/experiences/services/experience-capability.service';
import { ExperienceKeywordController } from '🔥apps/server/experiences/controllers/experience-capability.controller';

@Module({
  controllers: [ExperienceController, ExperienceKeywordController],
  providers: [ExperienceService, ExperienceCapabilityService, ...experienceProviders],
  exports: [ExperienceService],
})
export class ExperienceModule {}
