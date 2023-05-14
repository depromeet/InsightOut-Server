import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninRequestBodyDto {
  @ApiProperty({ description: '구글 idToken' })
  @IsString()
  idToken: string;
}
