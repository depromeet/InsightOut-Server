import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UnknownException } from '../../exceptions/unknown.exception';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request;
    if (!request['user']) {
      throw new UnknownException({
        title: '유저',
        message: '유저데이터가 없습니다.',
        raw: null,
      });
    }
    return request['user'];
  },
);
