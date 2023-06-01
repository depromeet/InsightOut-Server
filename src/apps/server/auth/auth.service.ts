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
        // 랜덤 닉네임 발급. 5글자 이하
        const nickname = await this.apiService.getRandomNickname();

        /**
         * 트랜잭션을 시작합니다.
         *
         * 프리즈마에서 제공하는 트랜잭션은 두 가지가 있습니다.
         * 1. 공식적인 방법으로, 비동기 값을 해결하지 않은 채로 변수에 할당한 다음, 트랜잭션의 인자로 전달합니다.
         * @example const user = await this.prisma.user.create();
         * await this.prisma.$transaction([user]);
         *
         * 2. preview 방식으로, 트랜잭션의 인자로서 비동기 함수를 입력합니다.
         * 해당 비동기 함수에서 트랜잭션 및 서비스를 진행한 뒤 return 하여 외부로 값을 반환합니다.
         *
         * 해당 로직에서는 2번 preview 방식을 택했습니다.
         */
        const user = await this.prismaService.$transaction(async (prisma) => {
          // 기본 유저를 생성합니다.
          const newUser = await prisma.user.create({
            data: {
              email,
              socialId,
              nickname,
            },
          });

          // 해당 유저의 정보를 입력합니다. 기본적으로 Google이 소셜 로그인 제공자입니다.
          await prisma.userInfo.create({
            data: {
              User: {
                connect: { id: newUser.id },
              },
              provider: Provider.GOOGLE,
              imageUrl: picture,
            },
          });

          // 기본 자기소개서를 생성합니다.
          await prisma.resume.create({
            data: {
              title: '자기소개서 예시',
              userId: newUser.id,
              Question: {
                create: {
                  title: '샘플) 자신의 경쟁력에 대해 구체적으로 적어 주세요.',
                },
              },
            },
          });

          /**
           * 기본 역량 키워드들을 생성합니다.
           *
           * 기본 역량 키워드는 아래 17개와 같습니다.
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

          // 처리한 트랜잭션 커밋 중 user만 반환합니다.
          return newUser;
        });

        // 액세스 토큰 발급을 위해 id를 반환합니다.
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

  // 액세스 토큰을 발급합니다.
  issueAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }

  // 리프레시 토큰을 발급합니다.
  issueRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'), // TODO Access token과 Refresh token의 secret 분리하기
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );
  }

  // Refresh token을 레디스에 저장합니다.
  public async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.redisService.set(String(userId), refreshToken, REFRESH_TOKEN_EXPIRES_IN);
  }

  // 쿠키 옵션을 가져옵니다.
  getCookieOptions(tokenType: TokenType): CookieOptions {
    const maxAge = tokenType === TokenType.AccessToken ? ACCESS_TOKEN_EXPIRES_IN * 1000 : REFRESH_TOKEN_EXPIRES_IN * 1000;

    // TODO https 설정 후 추가 작성
    return {
      maxAge,
      httpOnly: false,
    };
  }

  // 요청 객체에 리프레시 토큰이 있는지 탐색합니다.
  trackRefreshToken(request: Request): string {
    return request?.cookies?.refreshToken;
  }

  // 리프레시 토큰을 재발급 받습니다.
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
