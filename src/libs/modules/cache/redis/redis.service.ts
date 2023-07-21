import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  // value 가져오기
  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  /**
   * key-value 저장
   *
   * @param key 레디스에 저장할 키
   * @param value 레디스에 저장할 값
   * @param expire 유효기간 - 초 단위
   * @returns 완료 후 'OK'를 반환
   */
  async set(key: string, value: any, expire = 3600): Promise<'OK'> {
    return await this.redisClient.set(key, value, 'EX', expire);
  }

  // key 삭제
  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
