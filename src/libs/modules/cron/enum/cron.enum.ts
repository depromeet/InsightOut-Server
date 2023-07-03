export enum CronJobStatus {
  WAITING = 'waiting',
  START = 'start',
  PROGRESSGNG = 'progressing',
  STOP = 'stop',
  FAIL = 'fail',
  END = 'end',
}

export enum CronJobTypeEnum {
  SCHEDULE_CRON = 'scheduleCron',
}
