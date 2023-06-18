import { ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredException } from '🔥apps/server/common/exceptions/token-expired.exception';
import { TokenType } from '📚libs/enums/token.enum';
import { NoAuthTokenException } from '🔥apps/server/common/exceptions/no-token.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, _context: ExecutionContext, _status?: any): TUser {
    if (info instanceof JsonWebTokenError) {
      if (info instanceof TokenExpiredError) {
        throw new TokenExpiredException(TokenType.AccessToken);
      }
      throw new UnauthorizedException(info.message);
    }

    if (info?.message === 'No auth token') {
      throw new NoAuthTokenException();
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
