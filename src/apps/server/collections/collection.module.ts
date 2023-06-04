import { Module } from '@nestjs/common';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { CollectionsController } from '🔥apps/server/collections/collection.controller';
import { CollectionsService } from '🔥apps/server/collections/collection.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, ExperienceRepository, ResumeRepository],
})
export class CollectionsModule {}
