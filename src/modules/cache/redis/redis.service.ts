import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = redisService.getClient();
  }

  // value 가져오기
  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  // key-value 저장
  async set(key: string, value: any, expire?: number): Promise<'OK'> {
    return await this.redisClient.set(key, value, 'EX', expire);
  }

  // key 삭제
  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
