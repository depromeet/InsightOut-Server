import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { PostSinginRequestBodyForGuard } from '@apps/server/auth/dtos/postSignin.dto';
import { FirebaseService } from '@libs/modules/firebase/firebase.service';

@Injectable()
export class SigninGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: PostSinginRequestBodyForGuard = context.switchToHttp().getRequest();

    const { idToken } = request.body;
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      const user = {
        email: decodedToken.email,
        socialId: decodedToken.sub,
        picture: decodedToken?.picture,
        uid: decodedToken.uid,
      };
      request.user = user;

      return decodedToken ? true : false;
    } catch (e) {
      throw new UnauthorizedException(`Firebase verify token error: ${e}`);
    }
  }
}
