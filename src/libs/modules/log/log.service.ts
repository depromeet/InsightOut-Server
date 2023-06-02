import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogService {
  private readonly logger = new Logger();

  debug(label: string, message: string, data: any = {}): void {
    this.logger.debug({ message, ...data }, label);
  }

  info(label: string, message: string, data: any = {}): void {
    this.logger.log({ message, ...data }, label);
  }

  error(label: string, error: Error): void {
    this.logger.error(error.name, [error.message, error.stack].join('\n'), label);
  }
}
