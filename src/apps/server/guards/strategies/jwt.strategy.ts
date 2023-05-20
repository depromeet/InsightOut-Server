import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../../../modules/database/repositories/user.repository';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExipration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: UserJwtToken): Promise<UserJwtToken> {
    const { userId } = payload;

    const isExistUser = await this.userRepository.findFirst({ id: userId });
    if (!isExistUser) {
      throw new NotFoundException('User not found');
    }

    return payload;
  }
}
