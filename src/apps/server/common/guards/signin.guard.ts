import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SinginRequestBody } from './signin-request-body.interface';
import { FirebaseService } from '@modules/firebase/firebase.service';

@Injectable()
export class SigninGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: SinginRequestBody = context.switchToHttp().getRequest();

    const { idToken } = request.body;
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      const user = {
        email: decodedToken.email,
        socialId: decodedToken.sub,
        picture: decodedToken.picture,
      };
      request.user = user;

      return decodedToken ? true : false;
    } catch (e) {
      throw new UnauthorizedException(`Firebase verify token error: ${e}`);
    }
  }
}
