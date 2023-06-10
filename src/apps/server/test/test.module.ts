import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from '📚libs/modules/cache/redis/redis.module';
import { OpenAiModule } from '📚libs/modules/open-ai/open-ai.module';

@Module({
  imports: [JwtModule, RedisCacheModule, OpenAiModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
