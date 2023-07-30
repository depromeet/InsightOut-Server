import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from '📚libs/modules/cache/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { CookieOptions } from 'express';
import { KeywordType, Provider } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenAndRefreshToken, UserWithRefreshTokenPayload } from './types/jwtToken.type';
import { ApiService } from '📚libs/modules/api/api.service';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '🔥apps/server/common/consts/jwt.const';
import { UserPayload } from '🔥apps/server/auth/dtos/postSignin.dto';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { DEFAULT_CAPABILITIES } from '🔥apps/server/common/consts/defaultCapability.const';
import { isFirebaseAuthError } from '🔥apps/server/common/types/firebaseAuth.type';
import { FirebaseService } from '📚libs/modules/firebase/firebase.service';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { TokenType } from '📚libs/enums/token.enum';
import { TokenExpiredException } from '🔥apps/server/common/exceptions/tokenExpired.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisCacheService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly userRepository: UserRepository,
    private readonly apiService: ApiService,
    private readonly firebaseService: FirebaseService,
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
  public async signin(user: UserPayload): Promise<{
    userId: number;
    nickname: string;
  }> {
    try {
      const { email, picture, socialId, uid } = user;

      const existUser = await this.userRepository.findFirst({
        where: { email },
        select: { id: true, nickname: true },
      });

      // If user exists, pass to signin
      if (!existUser) {
        // 랜덤 닉네임 발급. 4 ~ 8글자
        const nickname = this.apiService.getRandomNickname();

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
        const newUser = await this.prismaService.$transaction(async (prisma) => {
          // 기본 유저를 생성합니다.
          const user = await prisma.user.create({
            data: {
              uid,
              email,
              socialId,
              nickname,
            },
          });

          // 해당 유저의 정보를 입력합니다. 기본적으로 Google이 소셜 로그인 제공자입니다.
          await prisma.userInfo.create({
            data: {
              User: {
                connect: { id: user.id },
              },
              provider: Provider.GOOGLE,
              imageUrl: picture,
            },
          });

          // 온보딩 여부 row를 추가합니다.
          await prisma.onboarding.create({
            data: {
              userId: user.id,
            },
          });

          // 기본 자기소개서를 생성합니다.
          await prisma.resume.create({
            data: {
              title: '자기소개서 예시',
              userId: user.id,
              Questions: {
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
                keywordType: KeywordType.USER,
                keyword: capability,
                userId: user.id,
              };
            }),
          });

          // 처리한 트랜잭션 커밋 중 user와 userInfo만 반환합니다.
          return user;
        });

        // 액세스 토큰 발급을 위해 id를 반환합니다.
        return { userId: newUser.id, nickname: newUser.nickname };
      }

      return { userId: existUser.id, nickname: existUser.nickname };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
    }
  }

  // 액세스 토큰을 발급합니다.
  issueAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: this.envService.get<string>(EnvEnum.JWT_ACCESS_TOKEN_SECRET),
      },
    );
  }

  // 리프레시 토큰을 발급합니다.
  issueRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        secret: this.envService.get<string>(EnvEnum.JWT_REFRESH_TOKEN_SECRET),
      },
    );
  }

  // Refresh token을 레디스에 저장합니다.
  public async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.redisService.set(String(userId), refreshToken, REFRESH_TOKEN_EXPIRES_IN);
  }

  // 쿠키 옵션을 가져옵니다.
  getCookieOptions(tokenType: TokenType): Partial<CookieOptions> {
    const maxAge = tokenType === TokenType.AccessToken ? ACCESS_TOKEN_EXPIRES_IN * 1000 : REFRESH_TOKEN_EXPIRES_IN * 1000;

    const cookieOption: CookieOptions =
      this.envService.get<string>(EnvEnum.NODE_ENV) === 'main'
        ? {
            maxAge,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }
        : {
            maxAge,
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
          };

    return cookieOption;
  }

  // 요청 객체에 액세스 토큰이 있는지 탐색합니다.
  extractAccessToken(request: Request): string {
    return request?.cookies?.accessToken;
  }

  // 요청 객체에 리프레시 토큰이 있는지 탐색합니다.
  extractRefreshToken(request: Request): string {
    return request?.cookies?.refreshToken;
  }

  // 리프레시 토큰을 재발급 받습니다.
  public async rotateRefreshToken(userPayload: UserWithRefreshTokenPayload): Promise<AccessTokenAndRefreshToken> {
    const { userId, refreshToken } = userPayload;
    const savedRefreshToken = await this.redisService.get(String(userId));

    if (refreshToken !== savedRefreshToken) {
      throw new TokenExpiredException(TokenType.RefreshToken);
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

    try {
      await this.prismaService.$transaction(
        async (tx) => {
          // 1. 유저가 DB에 존재하는지 확인합니다.
          const exUser = await tx.user.findFirst({ where: { id: userId } });
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

          await tx.user.delete({ where: { id: userId } });

          // 전체 과정이 수행된 후, firebase에서 uid를 통해 유저를 삭제합니다.
          // TODO MQ를 사용해서 무조건 삭제되도록 처리하기
          await this.firebaseService.withdraw(exUser.uid);
          // Redis에서 refresh 토큰을 삭제합니다.
          await this.redisService.del(String(userId));
        },
        { isolationLevel: 'Serializable' },
      );
    } catch (error) {
      if (isFirebaseAuthError(error)) {
        throw new BadRequestException('Invalid Firebase request. Please check idToken');
      }
      throw error;
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
