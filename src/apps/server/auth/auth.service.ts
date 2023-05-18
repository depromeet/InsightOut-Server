import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RedisCacheService } from '../../../modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../consts/jwt.const';
import { UserPayload } from '../guards/signin-request-body.interface';
import { UserRepository } from '../../../modules/database/repositories/user.repository';
import { CookieOptions } from 'express';
import { UserInfoRepository } from '../../../modules/database/repositories/user-info.repository';
import { Provider } from '@prisma/client';
import { TokenType } from '../../../enums/token.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
  ) {}

  async signin(user: UserPayload): Promise<number> {
    try {
      const { email, picture, socialId } = user;

      const existUser = await this.userRepository.findFirst({ socialId });

      // If user exists, pass to signin
      if (!existUser) {
        const nickname = await this.getRandomNickname();
        const newUser = await this.userRepository.insertUser({
          email,
          socialId,
          nickname,
        });
        await this.userInfoRepository.insertUserInfo({
          User: {
            connect: { userId: newUser.userId },
          },
          provider: Provider.google,
          imageUrl: picture,
        });
        return newUser.userId;
      }
      return existUser.userId;
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

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.redisService.set(
      String(userId),
      refreshToken,
      REFRESH_TOKEN_EXPIRES_IN,
    );
  }

  async getRandomNickname(): Promise<string> {
    const response = await fetch(
      'https://nickname.hwanmoo.kr/?format=text&max_length=6',
    );

    const responseData = await response.text();
    return responseData;
  }

  getCookieOptions(tokenType: TokenType): CookieOptions {
    const maxAge =
      tokenType === TokenType.AccessToken
        ? ACCESS_TOKEN_EXPIRES_IN
        : REFRESH_TOKEN_EXPIRES_IN;

    // TODO https 설정 후 추가 작성
    return {
      maxAge,
      httpOnly: false,
    };
  }
}
