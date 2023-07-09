import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Capability } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
 * 유저 역량 키워드 추가 응답 DTO
 */
export class AddUserCapabilityResDto {
  @Exclude() _id: number;
  @Exclude() _keyword: string;
  @Exclude() _userId: number;

  constructor(userCapability: Capability) {
    this._id = userCapability.id;
    this._keyword = userCapability.keyword;
    this._userId = userCapability.userId;
  }

  @ApiProperty({ example: 1 })
  @Expose()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @ApiProperty({ example: '문제해결역량' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  get keyword(): string {
    return this._keyword;
  }

  @ApiPropertyOptional({
    example: 1,
  })
  @Expose()
  @IsNotEmpty()
  @IsInt()
  get userId(): number {
    return this._userId;
  }
}

export class AddUserCapabilityConflictErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: '문제해결역량 해당 키워드가 이미 존재합니다. 확인 부탁드립니다',
  })
  message: string;
}
