import { BadRequestException } from '@nestjs/common';
import { CronJobTypeEnum } from '📚libs/modules/cron/enum/cron.enum';

/**
 * CronJob을 돌릴 때 해당 작업(job)에 맞게 구상할 수 있는 abstract class입니다.
 */
export default abstract class AbstractCronJob {
  private CRONJOB_NAME: string;
  private CRONJOB_TYPE: CronJobTypeEnum;

  constructor(cronjobName: string, cronjobType: CronJobTypeEnum) {
    this.CRONJOB_NAME = cronjobName;
    this.CRONJOB_TYPE = cronjobType;
  }

  /**
   * Cron이 시작 전에 진행할 작업을 넣는다
   */
  private async beforeCron() {
    console.log('시작');
    // 수행전 작업
  }

  /**
   * Cron이 끝난 뒤 진행할 작업을 넣는다.
   * @param result 결과값
   * @param message 메세지
   */
  private async afterCron<T>(result?: T, message?: string) {
    console.log('끝');
    // 수행후 작업
  }

  public async start() {
    await this.excuteCron();
  }

  /**
   * Cron Start
   */
  public async excuteCron() {
    try {
      await this.beforeCron();

      console.time('excuteJob');
      const result = await this.job();
      console.timeEnd('excuteJob');

      await this.afterCron(result);

      return result;
    } catch (err) {
      //실패 하게 되면 Cron의 상태를 실패 상태로 업데이트 => 추후 작업
      throw new BadRequestException('CronJob에 실패하였습니다.');
    }
  }

  /**
   * Cron Job을 실행할 추상 부분.
   */
  protected abstract job();
}
