import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsInstance, IsInt, IsNotEmpty, IsObject, IsPositive, IsString, IsUUID, IsUrl } from 'class-validator';

import { GetAllOnboardingsResponseDto } from '@apps/server/onboardings/dtos/res/getOnboarding.dto';

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
  picture?: string | undefined;

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
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class PostSigninResponseDto {
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _onboarding: GetAllOnboardingsResponseDto;
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _nickname: string;

  constructor(accessToken: string, onboarding: GetAllOnboardingsResponseDto, userId: number, nickname: string) {
    this._accessToken = accessToken;
    this._onboarding = onboarding;
    this._userId = userId;
    this._nickname = nickname;
  }

  @Expose()
  @ApiProperty({
    description: '## 액세스 토큰입니다.\n해당 Access token을 Authorization 헤더에 bearer로 넣어서 요청을 보내주세요.',
    example: 'eyJhbGciOiJIUzI1N...',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  get accessToken(): string {
    return this._accessToken;
  }

  @Expose()
  @ApiProperty({
    description: '## 유저의 온보딩 체크 여부입니다.',
    type: GetAllOnboardingsResponseDto,
  })
  @IsObject()
  @IsInstance(GetAllOnboardingsResponseDto)
  @IsNotEmpty()
  get onboarding(): GetAllOnboardingsResponseDto {
    return this._onboarding;
  }

  @Expose()
  @ApiProperty({
    description: '## 유저의 고유 아이디입니다.',
    example: 1234,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  @ApiProperty({
    description: '## 유저의 닉네임입니다.',
    example: '배부른 냄비',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  get nickname(): string {
    return this._nickname;
  }
}
