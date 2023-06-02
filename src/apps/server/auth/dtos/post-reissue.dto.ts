import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostReissueResponseDto {
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
