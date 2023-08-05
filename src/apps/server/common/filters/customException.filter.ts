import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

import { LogService } from '@libs/modules/log/log.service';
import { SlackService } from '@libs/modules/slack/slack.service';

import { BaseException } from '../exceptions/base.exception';
import { UnknownException } from '../exceptions/unknown.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logService: LogService,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly slackService: SlackService,
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const exception = (() => {
      if (error instanceof BaseException) {
        return error;
      }

      if (error instanceof HttpException) {
        return new BaseException({
          statusCode: error.getStatus(),
          title: error.name,
          message: error.message,
          raw: error,
        });
      }

      // TODO Prisma 에러코드 별 상태 코드 설정 추가
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1003') {
          return new InternalServerErrorException({
            title: error.name,
            message: error.message,
            raw: error,
          });
        }
      }
      return new UnknownException({
        title: error.name,
        message: error.message,
        raw: error,
      });
    })();

    this.logService.error(CustomExceptionFilter.name, exception);

    this.httpAdapterHost.httpAdapter.reply((() => host.switchToHttp().getResponse())(), exception.getResponse(), exception.getStatus());
  }
}
