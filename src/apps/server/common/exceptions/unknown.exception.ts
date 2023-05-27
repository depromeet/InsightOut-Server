import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnknownException extends BaseException {
  constructor(properties: Pick<BaseException, 'title' | 'message' | 'raw'>) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      title: properties.title,
      message: properties.message,
      raw: properties.raw,
    });
  }
}
