import { HttpStatus } from '@nestjs/common';
import { TokenType } from '📚libs/enums/token.enum';
import { BaseException } from '🔥apps/server/common/exceptions/base.exception';
import { JwtExpiredType } from '🔥apps/server/common/types/jwtExpiration.type';

export class TokenExpiredException extends BaseException {
  constructor(tokenType: TokenType) {
    const exceptionResponse =
      tokenType === TokenType.AccessToken
        ? {
            title: JwtExpiredType.AccessTokenExpired,
            message: 'AccessToken expired',
          }
        : {
            title: JwtExpiredType.RefreshTokenExpired,
            message: 'RefreshToken expired',
          };
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      ...exceptionResponse,
    });
  }
}
