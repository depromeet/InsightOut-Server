import { Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

export const ServerAppFilterProvider: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },
];
