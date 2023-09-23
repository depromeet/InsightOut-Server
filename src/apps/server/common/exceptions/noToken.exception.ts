import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/exceptions/base.exception';

export class NoAuthTokenException extends BaseException {
  constructor(message?: string) {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      title: 'NoAuthTokenException',
      message,
    });
  }
}
