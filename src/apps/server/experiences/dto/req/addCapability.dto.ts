import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCapabilitydBodyRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '문제해결역량' })
  keyword: string;
}
