import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { TokenType } from '📚libs/enums/token.enum';
import { NoAuthTokenException } from '🔥apps/server/common/exceptions/no-token.exception';
import { TokenExpiredException } from '🔥apps/server/common/exceptions/token-expired.exception';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }
  handleRequest(_err: any, user: any, info: any, _context: ExecutionContext, _status?: any) {
    if (info instanceof JsonWebTokenError) {
      if (info instanceof TokenExpiredError) {
        throw new TokenExpiredException(TokenType.RefreshToken);
      }
      throw new UnauthorizedException(info.message);
    }

    if (info.message === 'No auth token') {
      throw new NoAuthTokenException();
    }

    if (!user) {
      throw new UnauthorizedException('적절하지 않은 요청입니다.');
    }
    return user;
  }
}
