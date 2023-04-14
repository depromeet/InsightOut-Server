import { ClassSerializerInterceptor, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './interceptors/log.interceptor';

export const InterceptorProvider: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LogInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
];
