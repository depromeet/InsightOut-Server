import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ExperienceModule } from '@apps/server/experiences/experience.module';
import { OnboardingsModule } from '@apps/server/onboardings/onboarding.module';
import { UserModule } from '@apps/server/users/user.module';
import { RedisConfigFactory } from '@libs/modules/cache/redis/redis.factory';
import { CronModule } from '@libs/modules/cron/cron.module';
import { DatabaseModule } from '@libs/modules/database/database.module';
import { EnvModule } from '@libs/modules/env/env.module';
import { LogModule } from '@libs/modules/log/log.module';
import { SlackModule } from '@libs/modules/slack/slack.module';

import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ValidationException } from './common/exceptions/validation.exception';
import { CustomExceptionFilter } from './common/filters/customException.filter';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { ResumesModule } from './resumes/resumes.module';
import { TestModule } from './test/test.module';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule.forRoot(),
    EnvModule.forRoot(),
    LogModule.forRoot(),
    CronModule.forRoot(),
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
    UserModule,
    OnboardingsModule,
    AiModule,
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
