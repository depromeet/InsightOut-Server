import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { FirebaseService } from '📚libs/modules/firebase/firebase.service';
import { isFirebaseAuthError } from '🔥apps/server/common/types/firebase-auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly apiService: ApiService,
    private readonly firebaseService: FirebaseService,
  ) {}

  public async signin(user: UserPayload): Promise<number> {
    try {
      const { email, picture, socialId, uid } = user;

      const existUser = await this.userRepository.findFirst({ where: { socialId, uid } });

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

  /**
   * 유저 회원가입 handler입니다.
   * 1. user가 있는지 확인하고 일치한 경우 유저를 삭제합니다.
   * 2. refreshToken을 조회하여 유저의 refreshToken과 일치하는지 확인한 후 삭제합니다.
   * 3. firebase/auth에서 전체
   * @param user userId와 refreshToken을 담은 객체입니다.
   */
  async withdraw(user: UserWithRefreshTokenPayload) {
    const { userId, refreshToken } = user;

    // 1. 유저가 DB에 존재하는지 확인합니다.
    const exUser = await this.userRepository.findFirst({ where: { id: userId } });
    if (!exUser) {
      throw new NotFoundException('User not found');
    }

    /** 2. redis에 저장된 refresh 토큰과 유저의 refresh 토큰이 같은지 비교합니다.
     * 유효한지 검사하는 과정이며, 같지 않을 시 인가되지 않은 것으로 판단합니다.
     */
    const existedRefreshToken = await this.redisService.get(String(userId));
    if (refreshToken !== existedRefreshToken) {
      throw new UnauthorizedException('Token is not valid');
    }

    try {
      // 전체 과정이 수행된 후, firebase에서 uid를 통해 유저를 삭제합니다.
      await this.firebaseService.withdraw(exUser.uid);

      // Redis에서 refresh 토큰을 삭제합니다.
      await this.redisService.del(String(userId));
    } catch (error) {
      if (isFirebaseAuthError(error)) {
        throw new BadRequestException('Invalid Firebase request.');
      }
    }
  }

  /**
   * 로그아웃을 처리합니다.
   *
   * 1. 레디스에 있는 Refresh token을 가져옵니다.
   * 2. 요청의 쿠키 중 refreshToken의 값과 서로 같은지 확인합니다.
   * 3. 값이 같지 않다면, 인가되지 않은 요청이므로 예외를 일으킵니다.
   * 4. 값이 같다면, 유효한 요청이라 판단하여 refresh token을 삭제합니다.
   */
  async signout(user: UserWithRefreshTokenPayload) {
    const { userId, refreshToken } = user;

    // 1. 레디스에서 Refresh token을 가져옵니다.
    const existedRefreshToken = await this.redisService.get(String(userId));

    // 2. 요청의 쿠키 중 refreshToken의 값과 서로 비교합니다.
    if (existedRefreshToken !== refreshToken) {
      // 3. 만약 값이 같지 않다면 예외를 일으킵니다.
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 4. 만약 값이 같다면 refreshToken을 레디스에서 삭제합니다.
    await this.redisService.del(String(userId));
  }
}
