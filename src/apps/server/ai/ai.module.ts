import { Module } from '@nestjs/common';

import { aiProviders } from '@apps/server/ai/providers/ai.provider';
import { ExperienceModule } from '@apps/server/experiences/experience.module';
import { RedisCacheModule } from '@libs/modules/cache/redis/redis.module';
import { OpenAiModule } from '@libs/modules/open-ai/openAi.module';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [OpenAiModule, ExperienceModule, RedisCacheModule],
  providers: [AiService, ...aiProviders],
  controllers: [AiController],
})
export class AiModule {}
