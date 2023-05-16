import { Injectable } from '@nestjs/common';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { TokenPayload } from 'google-auth-library';
import { RedisCacheService } from '../../../modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_EXPIRES_IN } from '../consts/jwt.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(body: SigninRequestBodyDto, user: TokenPayload) {
    const result = await this.redisService.set('test', '123');
    console.log(result);
  }

  issueAccessToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
      },
    );
  }

  issueRefreshToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
      },
    );
  }
}
