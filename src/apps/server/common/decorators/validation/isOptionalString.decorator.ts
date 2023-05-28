import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function IsOptionalString(min: number, max: number) {
  return applyDecorators(IsOptional(), IsString(), Expose(), MaxLength(max), MinLength(min));
}
