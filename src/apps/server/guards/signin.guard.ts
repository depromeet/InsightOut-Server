import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SinginRequestBody } from './signin-request-body.interface';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SigninGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: SinginRequestBody = context.switchToHttp().getRequest();

    const { idToken } = request.body;

    const CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const client = new OAuth2Client(CLIENT_ID);

    try {
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
      });
      const payload: TokenPayload = ticket.getPayload();

      request.user = { email: payload.email, picture: payload.picture };

      return ticket ? true : false;
    } catch (error) {
      throw new UnauthorizedException('Invalid idToken:', error);
    }
  }
}
