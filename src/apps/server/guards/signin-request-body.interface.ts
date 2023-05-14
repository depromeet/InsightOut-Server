import { TokenPayload } from 'google-auth-library';

export interface SinginRequestBody {
  body: {
    idToken: string;
  };
  user?: TokenPayload;
}
