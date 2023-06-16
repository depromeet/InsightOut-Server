import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function IsOptionalString(min: number, max: number) {
  return applyDecorators(IsOptional(), IsString(), Expose(), MaxLength(max), MinLength(min));
}

export function IsNotEmptyString(min: number, max: number) {
  return applyDecorators(IsNotEmpty(), IsString(), Expose(), MaxLength(max), MinLength(min));
}
