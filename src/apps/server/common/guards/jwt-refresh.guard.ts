import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }
  handleRequest(
    _err: any,
    user: any,
    info: any,
    _context: ExecutionContext,
    _status?: any,
  ) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('만료된 refresh 토큰입니다.');
    }
    if (!user) {
      throw new UnauthorizedException('적절하지 않은 요청입니다.');
    }
    return user;
  }
}
