import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OpenAiService } from './openAi.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
