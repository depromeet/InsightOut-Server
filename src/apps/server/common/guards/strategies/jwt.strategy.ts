import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { EnvService } from '📚libs/modules/env/env.service';
import { AuthService } from '🔥apps/server/auth/auth.service';
import { UserJwtToken } from '\uD83D\uDD25apps/server/auth/types/jwtToken.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly authService: AuthService, readonly envService: EnvService, private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          const accessToken = authService.extractAccessToken(request);
          return accessToken;
        },
      ]),
      ignoreExipration: false,
      secretOrKey: envService.get<string>(EnvEnum.JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: UserJwtToken): Promise<UserJwtToken> {
    const { userId } = payload;

    const isExistUser = await this.userRepository.findFirst({ where: { id: userId } });
    if (!isExistUser) {
      throw new NotFoundException('User not found');
    }

    return payload;
  }
}
