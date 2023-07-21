import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export function IsOptionalNumber() {
  return applyDecorators(
    IsOptional(),
    IsNumber(),
    Type(() => Number),
    Expose(),
  );
}

export function IsNotEmptyNumber() {
  return applyDecorators(
    IsNotEmpty(),
    IsNumber(),
    Type(() => Number),
    Expose(),
  );
}
