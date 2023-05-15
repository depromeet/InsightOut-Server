import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis.service';

@Module({
  imports: [RedisModule],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
