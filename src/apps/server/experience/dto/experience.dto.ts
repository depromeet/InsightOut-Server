import { ApiProperty } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExperinceDto {
  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceId: number;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceInfoId: number;

  @ApiProperty({ required: false, example: '00직무 디자인 인턴' })
  @IsString()
  @IsOptional()
  @Expose()
  title: string;

  @ApiProperty({
    required: false,
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsString()
  @IsOptional()
  @Expose()
  motivate: string;

  @ApiProperty({
    required: false,
    example: 'UI/UX 디자이너',
  })
  @IsString()
  @IsOptional()
  @Expose()
  experienceRole: string;

  @ApiProperty({ required: false, example: '2022-01' })
  @IsString()
  @IsOptional()
  @Expose()
  startDate: string;

  @ApiProperty({ required: false, example: '2022-07' })
  @IsString()
  @IsOptional()
  @Expose()
  endDate: string;

  @ApiProperty({
    required: false,
    example: 'inprogress or done',
    default: 'inprogress',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  experienceStatus: ExperienceStatus = ExperienceStatus.inprogress;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  userId: number;
}
