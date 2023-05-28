import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export function IsOptionalNumber() {
  return applyDecorators(
    IsOptional(),
    IsNumber(),
    Type(() => Number),
    Expose(),
  );
}
