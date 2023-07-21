import { Module } from '@nestjs/common';
import { ResumesController } from './controllers/resumes.controller';
import { ResumesService } from './services/resumes.service';
import { Repositories } from './resume.provider';
import { QuestionsService } from './services/question.service';
import { QuestionsController } from './controllers/question.controller';
import { ApiModule } from '📚libs/modules/api/api.module';

@Module({
  imports: [ApiModule],
  controllers: [ResumesController, QuestionsController],
  providers: [ResumesService, QuestionsService, ...Repositories],
})
export class ResumesModule {}
