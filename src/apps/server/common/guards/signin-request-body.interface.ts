export interface SinginRequestBody {
  body: {
    idToken: string;
  };
  user?: UserPayload;
}

export interface UserPayload {
  email: string;
  picture: string;
  socialId: string;
  uid: string;
}
