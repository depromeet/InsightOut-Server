import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninGuard } from '../guards/signin.guard';
import { RedisCacheModule } from '../../../modules/cache/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../modules/database/repositories/user.repository';
import { JwtStrategy } from '../guards/strategies/jwt.strategy';
import { UserInfoRepository } from '../../../modules/database/repositories/user-info.repository';
import { JwtRefreshStrategy } from '../guards/strategies/jwt-refresh.strategy';

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
