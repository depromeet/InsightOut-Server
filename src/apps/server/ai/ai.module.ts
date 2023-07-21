import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { aiProviders } from '🔥apps/server/ai/providers/ai.provider';
import { OpenAiModule } from '📚libs/modules/open-ai/open-ai.module';
import { ExperienceModule } from '🔥apps/server/experiences/experience.module';
import { RedisCacheModule } from '📚libs/modules/cache/redis/redis.module';

@Module({
  imports: [OpenAiModule, ExperienceModule, RedisCacheModule],
  providers: [AiService, ...aiProviders],
  controllers: [AiController],
})
export class AiModule {}
