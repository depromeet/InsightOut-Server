import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SigninRequestBodyDto } from './dtos/signin-request-body.dto';
import { RedisCacheService } from '../../../modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_EXPIRES_IN } from '../consts/jwt.const';
import { UserPayload } from '../guards/signin-request-body.interface';
import { UserRepository } from '../../../modules/database/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async signin(body: SigninRequestBodyDto, user: UserPayload) {
    try {
      const { email, picture, socialId } = user;

      const nickname = this.getRandomNickname();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  issueAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
      },
    );
  }

  issueRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
      },
    );
  }

  async getRandomNickname(): Promise<string> {
    const response = await fetch(
      'https://nickname.hwanmoo.kr/?format=text&max_length=6',
    );

    const responseData = await response.text();
    return responseData;
  }
}
