import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { UserPayload } from '../common/guards/signin-request-body.interface';
import { CookieOptions } from 'express';
import { UserInfoRepository } from '📚libs/modules/database/repositories/user-info.repository';
import { Provider } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenAndRefreshToken, UserWithRefreshTokenPayload } from './types/jwt-tokwn.type';
import { ApiService } from '📚libs/modules/api/api.service';
import { TokenType } from '📚libs/enums/token.enum';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '🔥apps/server/common/consts/jwt.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly apiService: ApiService,
  ) {}

  public async signin(user: UserPayload): Promise<number> {
    try {
      const { email, picture, socialId } = user;

      const existUser = await this.userRepository.findFirst({ socialId });

      // If user exists, pass to signin
      if (!existUser) {
        const nickname = await this.apiService.getRandomNickname();
        const newUser = await this.userRepository.insertUser({
          email,
          socialId,
          nickname,
          uid,
        });
        await this.userInfoRepository.insertUserInfo({
          User: {
            connect: { id: newUser.id },
          },
          provider: Provider.GOOGLE,
          imageUrl: picture,
        });
        return newUser.id;
      }
      return existUser.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException(error);
    }
  }

  issueAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }

  issueRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );
  }

  public async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.redisService.set(String(userId), refreshToken, REFRESH_TOKEN_EXPIRES_IN);
  }

  getCookieOptions(tokenType: TokenType): CookieOptions {
    const maxAge = tokenType === TokenType.AccessToken ? ACCESS_TOKEN_EXPIRES_IN * 1000 : REFRESH_TOKEN_EXPIRES_IN * 1000;

    // TODO https 설정 후 추가 작성
    return {
      maxAge,
      httpOnly: false,
    };
  }

  trackRefreshToken(request: Request): string {
    return request?.cookies?.refreshToken;
  }

  public async rotateRefreshToken(userPayload: UserWithRefreshTokenPayload): Promise<AccessTokenAndRefreshToken> {
    const { userId, refreshToken } = userPayload;
    const savedRefreshToken = await this.redisService.get(String(userId));

    if (refreshToken !== savedRefreshToken) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    const newAccessToken = this.issueAccessToken(userId);
    const newRefreshToken = this.issueRefreshToken(userId);

    await this.redisService.set(String(userId), newRefreshToken, REFRESH_TOKEN_EXPIRES_IN);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
