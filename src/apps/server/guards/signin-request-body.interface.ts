export interface SinginRequestBody {
  body: {
    idToken: string;
  };
  user?: UserPayload;
}

export interface UserPayload {
  email: string;
  picture: string;
}
