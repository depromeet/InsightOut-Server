import { ApiProperty } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExperinceDto {
  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  experienceId: number;

  @ApiProperty({ required: false, example: '00직무 디자인 인턴' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsString()
  @IsOptional()
  reason: string;

  @ApiProperty({ required: false, example: '2022-01' })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({ required: false, example: '2022-07' })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    required: false,
    example: 'inprogress or done',
    default: 'inprogress',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  experienceStatus: ExperienceStatus = ExperienceStatus.inprogress;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  userId: number;
}
