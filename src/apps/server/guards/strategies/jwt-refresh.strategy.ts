import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import {
  UserJwtToken,
  UserWithRefreshTokenPayload,
} from '../../auth/types/jwt-tokwn.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          return authService.trackRefreshToken(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: UserJwtToken,
  ): Promise<UserWithRefreshTokenPayload> {
    const refreshToken: string = this.authService.trackRefreshToken(request);
    return { refreshToken, ...payload };
  }
}
