import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class PostSinginRequestBodyForGuard {
  body: {
    idToken: string;
  };
  user?: UserPayload;
}

export class UserPayload {
  @ApiProperty({ description: '소셜 로그인 이메일' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '유저의 사진입니다. idToken verify 후 url로 들어옵니다.' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  picture: string;

  @ApiProperty({ description: '소셜 로그인 OAuth2 제공업체에서의 고유한 id입니다.' })
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @ApiProperty({ description: '소셜 로그인 OAuth2에서의 유저 uuid 입니다' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  uid: string;
}

export class PostSigninRequestBodyDto {
  @ApiProperty({ description: '구글 idToken' })
  @IsString()
  idToken: string;
}

export class PostSigninResponseDto {
  @Exclude() private readonly _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  @ApiProperty({
    description: '## 액세스 토큰입니다.\n해당 Access token을 Authorization 헤더에 bearer로 넣어서 요청을 보내주세요.',
    example: 'eyJhbGciOiJIUzI1N...',
  })
  @IsNotEmpty()
  @IsString()
  get accessToken(): string {
    return this._accessToken;
  }
}
