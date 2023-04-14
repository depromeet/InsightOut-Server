import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const ServerAppPipeProvider: Provider[] = [
  {
    provide: APP_PIPE,
    useFactory: () =>
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => errors,
      }),
  },
];
