import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from '@modules/cache/redis/redis.module';

@Module({
  imports: [JwtModule, RedisCacheModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
