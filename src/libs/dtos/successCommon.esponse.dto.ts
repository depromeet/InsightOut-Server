import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { EnumToArray } from '../utils/enumNumberToArray.function';

export class SuccessCommonEsponseDto<T> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: '상태코드', example: 200 })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({ type: Boolean, description: '성공여부', example: true })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    type: 'generic',
    description: 'object 또는 array 형식의 응답데이터',
  })
  @Expose()
  data: T;
}
