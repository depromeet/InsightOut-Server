import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredException } from '🔥apps/server/common/exceptions/token-expired.exception';
import { TokenType } from '📚libs/enums/token.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, _context: ExecutionContext, _status?: any): TUser {
    if (info instanceof TokenExpiredError) {
      throw new TokenExpiredException(TokenType.AccessToken);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
