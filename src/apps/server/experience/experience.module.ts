import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { experienceProviders } from './provider/experience.provider';

@Module({
  controllers: [ExperienceController],
  providers: [ExperienceService, ...experienceProviders],
})
export class ExperienceModule {}
