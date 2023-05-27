import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from 'src/modules/database/database.module';
import { EnvModule } from 'src/modules/env/env.module';
import { LogModule } from 'src/modules/log/log.module';
import { ValidationException } from './common/exceptions/validation.exception';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { SlackModule } from 'src/modules/slack/slack.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigFactory } from '@modules/cache/redis/redis.factory';
import { ExperienceModule } from './experience/experience.module';
import { ResumesModule } from './resumes/resumes.module';
import { TestModule } from './test/test.module';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule.forRoot(),
    EnvModule.forRoot(),
    LogModule.forRoot(),
    SlackModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: RedisConfigFactory,
    }),

    // Domains
    AuthModule,
    ExperienceModule,
    ResumesModule,
    TestModule,
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
