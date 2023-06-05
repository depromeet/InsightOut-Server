import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCapabilitydBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '문제해결역량' })
  keyword: string;
}
