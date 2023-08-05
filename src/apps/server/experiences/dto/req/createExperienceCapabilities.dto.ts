import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

const example = {
  리더십: true,
  문제해결력: true,
  문제해결역량: false,
  의사소통: false,
  커뮤니케이션: false,
  '협상/설득력': false,
  팀워크: false,
};
export class CreateExperienceCapabilitiesdBodyRequestDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ example })
  keywords: { [key in string] };

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  experienceId: number;
}
