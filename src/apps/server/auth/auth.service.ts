import { Injectable } from '@nestjs/common';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { TokenPayload } from 'google-auth-library';
import { RedisCacheService } from '../../../modules/cache/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisCacheService) {}

  async signin(body: SigninRequestBodyDto, user: TokenPayload) {
    const result = await this.redisService.set('test', '123');
    console.log(result);
  }
}
