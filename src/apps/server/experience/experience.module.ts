import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
