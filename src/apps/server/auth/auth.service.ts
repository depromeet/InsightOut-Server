import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { CookieOptions } from 'express';
import { UserInfoRepository } from '📚libs/modules/database/repositories/user-info.repository';
import { Provider } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenAndRefreshToken, UserWithRefreshTokenPayload } from './types/jwt-tokwn.type';
import { ApiService } from '📚libs/modules/api/api.service';
import { TokenType } from '📚libs/enums/token.enum';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '🔥apps/server/common/consts/jwt.const';
import { UserPayload } from '🔥apps/server/auth/dtos/post-signin.dto';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { DEFAULT_CAPABILITIES } from '🔥apps/server/common/consts/default-capability.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly capabilityRepository: CapabilityRepository,
    private readonly apiService: ApiService,
  ) {}

  /**
   * Auth guard를 거친 후에 실행되는 handler입니다. auth guard에서 token verify 후에 request user에 정보를 담고, 해당 정보를 api handler에서 사용합니다.
   *
   * 1. 만약 유저가 DB에 존재하지 않는다면, DB에 저장하여 회원가입 후 userId를 반환합니다.
   * 2. 만약 유저가 DB에 존재한다면, 바로 userId를 반환합니다.
   *
   * userId는 access token, refresh token 발급에 사용됩니다.
   * @param user email, picture, socialId 등이 담긴 객체입니다.
   * @returns
   */
  public async signin(user: UserPayload): Promise<number> {
    try {
      const { email, picture, socialId } = user;

      const existUser = await this.userRepository.findFirst({ socialId });

      // If user exists, pass to signin
      if (!existUser) {
        const nickname = await this.apiService.getRandomNickname();
        const user = await this.prismaService.$transaction(async (prisma) => {
          const newUser = await prisma.user.create({
            data: {
              email,
              socialId,
              nickname,
            },
          });
          await prisma.userInfo.create({
            data: {
              User: {
                connect: { id: newUser.id },
              },
              provider: Provider.GOOGLE,
              imageUrl: picture,
            },
          });

          await prisma.resume.create({
            data: {
              title: '샘플) 자신의 경쟁력에 대해 구체적으로 적어 주세요.',
              userId: newUser.id,
            },
          });

          /**
           * 리더십, 협상, 설득력, 커뮤니케이션, 팀워크, 도전력, 목표달성, 추진력, 문제해결력, 실행력, 분석력, 전략적사고, 창의력, 책임감, 적극성, 성실성, 자기계발
           */
          await prisma.capability.createMany({
            data: DEFAULT_CAPABILITIES.map((capability) => {
              return {
                keyword: capability,
                userId: newUser.id,
              };
            }),
          });
          return newUser;
        });

        return user.id;
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
