import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller';
import { ResumesProvider } from './resumes.service.ts';

@Module({
  imports: [],
  controllers: [ResumesController],
  providers: [ResumesProvider],
})
export class ResumesModule {}
