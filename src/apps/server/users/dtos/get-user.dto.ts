import { ApiProperty } from '@nestjs/swagger';
import { User, UserInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetUserResponseDto {
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _imageUrl: string;

  constructor(userWithInfo: Partial<User & { UserInfo: UserInfo }>) {
    this._nickname = userWithInfo.nickname;
    this._email = userWithInfo.email;
    this._imageUrl = userWithInfo.UserInfo.imageUrl;
  }

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  get nickname(): string {
    return this._nickname;
  }

  @Expose()
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  get email(): string {
    return this._email;
  }

  @Expose()
  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  get imageUrl(): string {
    return this._imageUrl;
  }
}
