import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisCacheModule } from '📚libs/modules/cache/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { UserInfoRepository } from '📚libs/modules/database/repositories/user-info.repository';
import { ApiModule } from '📚libs/modules/api/api.module';

import { SigninGuard } from '../common/guards/signin.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../common/guards/strategies/jwt-refresh.strategy';
import { FirebaseModule } from '📚libs/modules/firebase/firebase.module';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { OnboardingsModule } from '🔥apps/server/onboarding/onboarding.module';

@Module({
  imports: [
    RedisCacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
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
    CapabilityRepository,
  ],
})
export class AuthModule {}
