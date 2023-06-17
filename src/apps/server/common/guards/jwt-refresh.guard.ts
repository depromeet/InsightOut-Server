import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { TokenType } from '📚libs/enums/token.enum';
import { TokenExpiredException } from '🔥apps/server/common/exceptions/token-expired.exception';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }
  handleRequest(_err: any, user: any, info: any, _context: ExecutionContext, _status?: any) {
    if (info instanceof TokenExpiredError) {
      throw new TokenExpiredException(TokenType.RefreshToken);
    }
    if (!user) {
      throw new UnauthorizedException('적절하지 않은 요청입니다.');
    }
    return user;
  }
}
