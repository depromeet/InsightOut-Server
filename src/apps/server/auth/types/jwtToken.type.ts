export class UserJwtToken {
  userId: number;
}

export class UserWithRefreshTokenPayload extends UserJwtToken {
  refreshToken: string;
}

export class AccessTokenAndRefreshToken {
  accessToken: string;
  refreshToken: string;
}
