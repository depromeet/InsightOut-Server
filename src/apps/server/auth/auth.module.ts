import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninGuard } from '../guards/signin.guard';
import { RedisCacheModule } from '../../../modules/cache/redis/redis.module';

@Module({
  imports: [RedisCacheModule],
  controllers: [AuthController],
  providers: [AuthService, SigninGuard],
})
export class AuthModule {}
