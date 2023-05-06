import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from 'src/modules/database/database.module';
import { EnvModule } from 'src/modules/env/env.module';
import { LogModule } from 'src/modules/log/log.module';
import { ValidationException } from './exceptions/validation.exception';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { LogInterceptor } from './interceptors/log.interceptor';
import { IndexRouterModule } from './router/index.router';
import { SlackModule } from 'src/modules/slack/slack.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    EnvModule.forRoot(),
    LogModule.forRoot(),
    IndexRouterModule,
    SlackModule,
  ],
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
          exceptionFactory: (errors) => {
            throw new ValidationException(errors);
          },
        }),
    },
  ],
})
export class AppModule {}
