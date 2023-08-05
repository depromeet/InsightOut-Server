import { Module } from '@nestjs/common';

import { ApiModule } from '@libs/modules/api/api.module';

import { QuestionsController } from './controllers/question.controller';
import { ResumesController } from './controllers/resumes.controller';
import { Repositories } from './resume.provider';
import { QuestionsService } from './services/question.service';
import { ResumesService } from './services/resumes.service';

@Module({
  imports: [ApiModule],
  controllers: [ResumesController, QuestionsController],
  providers: [ResumesService, QuestionsService, ...Repositories],
})
export class ResumesModule {}
