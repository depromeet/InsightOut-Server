import { ApiProperty } from '@nestjs/swagger';
import { Field, User, UserInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetUserResponseDto {
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _field: Field;
  @Exclude() private readonly _imageUrl: string;

  constructor(userWithInfo: Partial<User & { UserInfo: UserInfo }>) {
    this._nickname = userWithInfo.nickname;
    this._email = userWithInfo.email;
    this._field = userWithInfo.UserInfo.field;
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
  @ApiProperty({
    description: '해당 유저의 직무입니다. 개발(DEVELOPMENT), 경영(MANAGEMENT), 마케팅(MARKETING) 등이 있습니다.',
    example: Field.DEVELOPMENT,
    type: Field,
    enum: Field,
  })
  @IsString()
  @IsEnum(Field)
  @IsNotEmpty()
  get field(): Field {
    return this._field;
  }

  @Expose()
  @ApiProperty({
    description: '해당 유저의 image 주소입니다.',
    example: 'www.naver.com',
    type: String,
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  get imageUrl(): string {
    return this._imageUrl;
  }
}
