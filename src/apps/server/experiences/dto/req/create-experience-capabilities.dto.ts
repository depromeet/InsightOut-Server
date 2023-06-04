import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateExperienceCapabilitiesdBodyDto {
  @Expose()
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['리더십', '협상/설득력', '커뮤니케이션', '팀워크'] })
  keywords: string[];
}
