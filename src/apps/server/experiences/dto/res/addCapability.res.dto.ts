import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Capability } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddCapabilityResDto {
  @Exclude() _id: number;
  @Exclude() _keyword: string;
  @Exclude() _userId: number;

  constructor(capability: Capability) {
    this._id = capability.id;
    this._keyword = capability.keyword;
    this._userId = capability.userId;
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
  get keyword(): string {
    return this._keyword;
  }

  @ApiPropertyOptional({
    example: 1,
  })
  @Expose()
  @IsNotEmpty()
  get userId(): number {
    return this._userId;
  }
}

export class AddCapabilityRequestErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: '문제해결역량 해당 키워드가 이미 존재합니다. 확인 부탁드립니다',
  })
  message: string;
}
