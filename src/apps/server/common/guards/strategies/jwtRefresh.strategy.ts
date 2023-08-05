import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@apps/server/auth/auth.service';
import { UserJwtToken, UserWithRefreshTokenPayload } from '@apps/server/auth/types/jwtToken.type';
import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService, readonly envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          return authService.extractRefreshToken(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: envService.get<string>(EnvEnum.JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: UserJwtToken): Promise<UserWithRefreshTokenPayload> {
    const refreshToken: string = this.authService.extractRefreshToken(request);
    return { refreshToken, ...payload };
  }
}
