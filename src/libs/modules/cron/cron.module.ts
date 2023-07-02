import { DynamicModule, Module } from '@nestjs/common';
import { RedisCacheModule } from '📚libs/modules/cache/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EveryDayAtMidNight } from '📚libs/modules/cron/service/every-day-at-midnight.service';

@Module({
  imports: [RedisCacheModule, ScheduleModule.forRoot()],
  providers: [EveryDayAtMidNight],
})
export class CronModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: CronModule,
    };
  }
}
