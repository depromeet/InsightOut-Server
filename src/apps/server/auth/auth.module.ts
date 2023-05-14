import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninGuard } from '../guards/signin.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SigninGuard],
})
export class AuthModule {}
