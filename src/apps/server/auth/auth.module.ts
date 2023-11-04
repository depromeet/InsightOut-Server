import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { OnboardingsModule } from '@apps/server/onboardings/onboarding.module';
import { ApiModule } from '@libs/modules/api/api.module';
import { RedisCacheModule } from '@libs/modules/cache/redis/redis.module';
import { CapabilityRepository } from '@libs/modules/database/repositories/capability/capability.interface';
import { CapabilityRepositoryImpl } from '@libs/modules/database/repositories/capability/capability.repository';
import { ResumeRepository } from '@libs/modules/database/repositories/resume.repository';
import { UserRepository } from '@libs/modules/database/repositories/user.repository';
import { UserInfoRepository } from '@libs/modules/database/repositories/userInfo.repository';
import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';
import { FirebaseModule } from '@libs/modules/firebase/firebase.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninGuard } from '../common/guards/signin.guard';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../common/guards/strategies/jwtRefresh.strategy';

@Module({
  imports: [
    RedisCacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (envService: EnvService) => {
        return {
          secret: envService.get<string>(EnvEnum.JWT_ACCESS_TOKEN_SECRET),
        };
      },
    }),
    ApiModule,
    FirebaseModule,

    // Domains
    OnboardingsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SigninGuard,
    JwtStrategy,
    JwtRefreshStrategy,

    // Repositories
    UserRepository,
    UserInfoRepository,
    ResumeRepository,
    {
      provide: CapabilityRepository,
      useClass: CapabilityRepositoryImpl,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
