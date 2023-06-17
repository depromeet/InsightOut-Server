import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { EnvService } from '📚libs/modules/env/env.service';
import { UserJwtToken } from '🔥apps/server/auth/types/jwt-tokwn.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly envService: EnvService, private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExipration: false,
      secretOrKey: envService.get<string>(EnvEnum.JWT_ACCEE_TOKEN_SECRET),
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
