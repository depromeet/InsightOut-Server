import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Capability } from '@prisma/client';
import { Exclude } from 'class-transformer';
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
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @ApiProperty({ example: '문제해결역량' })
  @IsNotEmpty()
  get keyword(): string {
    return this._keyword;
  }

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNotEmpty()
  get userId(): number {
    return this._userId;
  }
}

export class BadRequestErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: '데이터 형식이 잘못되었습니다.' })
  title: string;
  @ApiProperty({
    example:
      'action / 124 / action must be a string,action must be shorter than or equal to 100 characters,action must be longer than or equal to 0 characters\nexperienceStatus / INPROGRESS or DONE / experienceStatus must be one of the following values: INPROGRESS, DONE',
  })
  message: string;
}
