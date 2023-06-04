import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExperienceCapabilitiesdBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(4)
  @ArrayMinSize(0)
  @IsString({ each: true })
  @ApiProperty({ example: ['리더십', '협상/설득력', '커뮤니케이션', '팀워크'] })
  keywords: string[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  experienceId: number;
}
