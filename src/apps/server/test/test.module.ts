import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '@apps/server/auth/auth.module';
import { ApiModule } from '@libs/modules/api/api.module';
import { RedisCacheModule } from '@libs/modules/cache/redis/redis.module';
import { OpenAiModule } from '@libs/modules/openAi/openAi.module';

import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [JwtModule, RedisCacheModule, OpenAiModule, AuthModule, ApiModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
