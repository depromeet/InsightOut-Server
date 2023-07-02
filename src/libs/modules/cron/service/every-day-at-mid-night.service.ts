import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import AbstractCronJob from '📚libs/modules/cron/cron.abstract';
import { CronJobTypeEnum } from '📚libs/modules/cron/enum/cron.enum';

/**
 * 매일 자정에 이루어질 로직은 해당 부분에 구현하시면 됩니다.
 * 1. private으로 해야할 로직(함수)를 구현하기
 * 2. job안에서 실행시켜주기
 */
@Injectable()
export class EveryDayAtMidNightService extends AbstractCronJob {
  constructor(private readonly redisCacheService: RedisCacheService, private readonly envService: EnvService) {
    super('CronAtMidnight', CronJobTypeEnum.SCHEDULE_CRON);
  }

  /**
   * Cron을 핸들링하는 함수입니다.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  public async handleClon() {
    await this.start();
  }

  protected async job() {
    // 매일 자정에 프롬프트 횟수 초기화
    await this.promptReset();
  }

  /**
   *  매일 자정에 프롬프트 횟수 초기화하는 함수입니다.
   */
  private async promptReset() {
    const PROMPT_REDIS_KEY: string = this.envService.get(EnvEnum.PROMPT_REDIS_KEY);
    await this.redisCacheService.del(PROMPT_REDIS_KEY);
  }
}
