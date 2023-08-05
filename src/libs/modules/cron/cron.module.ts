import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RedisCacheModule } from '@libs/modules/cache/redis/redis.module';
import { EveryDayAtMidNightService } from '@libs/modules/cron/service/everyDayAtMidNight.service';

@Module({
  imports: [RedisCacheModule, ScheduleModule.forRoot()],
  providers: [EveryDayAtMidNightService],
})
export class CronModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: CronModule,
    };
  }
}
