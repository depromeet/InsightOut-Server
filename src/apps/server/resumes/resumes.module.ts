import { Module } from '@nestjs/common';
import { ResumesController } from './controllers/resumes.controller';
import { ResumesService } from './services/resumes.service';
import { Repositories } from './resume.provider';

@Module({
  imports: [],
  controllers: [ResumesController],
  providers: [ResumesService, ...Repositories],
})
export class ResumesModule {}
