import { ApiProperty } from '@nestjs/swagger';
import { Field } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchUserInfoBodyRequestDto {
  @ApiProperty({
    description: '유저 닉네임',
    example: '저뉴진스하입보이요',
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nickname?: string | undefined;

  @ApiProperty({
    description: '유저의 직무',
    enum: Field,
    type: Field,
    example: Field.DEVELOPMENT,
  })
  @IsEnum(Field)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  field?: Field | undefined;
}
