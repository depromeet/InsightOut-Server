export const JwtExpiredType = {
  AccessTokenExpired: 'AccessTokenExpired',
  RefreshTokenExpired: 'RefreshTokenExpired',
} as const;

export type JwtExpiredType = (typeof JwtExpiredType)[keyof typeof JwtExpiredType];
