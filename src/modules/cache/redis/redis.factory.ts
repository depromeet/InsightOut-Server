import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigFactory implements RedisOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    const host =
      this.configService.get('NODE_ENV') === 'dev'
        ? this.configService.get('REDIS_HOST_DEV')
        : this.configService.get('REDIS_HOST_PROD');
    const port =
      this.configService.get('NODE_ENV') === 'dev'
        ? +this.configService.get('REDIS_PORT_DEV')
        : +this.configService.get('REDIS_PORT_PROD');

    return {
      config: {
        host,
        port,
      },
    };
  }
}
