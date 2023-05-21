import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninGuard } from '../common/guards/signin.guard';
import { RedisCacheModule } from '../../../modules/cache/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../modules/database/repositories/user.repository';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { UserInfoRepository } from '../../../modules/database/repositories/user-info.repository';
import { JwtRefreshStrategy } from '../common/guards/strategies/jwt-refresh.strategy';
import { ApiModule } from '../../../modules/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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
  ],
})
export class AuthModule {}
