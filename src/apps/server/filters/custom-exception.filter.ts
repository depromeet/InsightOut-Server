import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LogService } from 'src/modules/log/log.service';
import { BaseException } from '../exceptions/base.exception';
import { UnknownException } from '../exceptions/unknown.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logService: LogService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const exception = (() => {
      if (error instanceof BaseException) {
        return error;
      } else if (error instanceof HttpException) {
        return new BaseException({
          statusCode: error.getStatus(),
          title: error.name,
          message: error.message,
          raw: error,
        });
      } else {
        return new UnknownException({
          title: error.name,
          message: error.message,
          raw: error,
        });
      }
    })();

    this.logService.error(CustomExceptionFilter.name, exception);

    this.httpAdapterHost.httpAdapter.reply(
      (() => host.switchToHttp().getResponse())(),
      exception.getResponse(),
      exception.getStatus(),
    );
  }
}
