import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCapabilitydBodyDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '문제해결역량' })
  keyword: string;
}
