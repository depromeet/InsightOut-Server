import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { IndexRouterModule } from './router/index.router';
import { DatabaseModule } from 'src/modules/database/database.module';
import { EnvModule } from 'src/modules/env/env.module';
import { LogModule } from 'src/modules/log/log.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { LogInterceptor } from './interceptors/log.interceptor';

@Module({
  imports: [DatabaseModule, EnvModule, LogModule, IndexRouterModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
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
          //Custom Exception으로 에러 변경 필요
          exceptionFactory: (errors) => errors,
        }),
    },
  ],
})
export class AppModule {}
