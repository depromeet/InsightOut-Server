import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class ExperinceDto {
  // experience
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsString()
  @IsOptional()
  @Expose()
  title?: string | null;

  @ApiPropertyOptional({ example: '2022-01' })
  @IsString()
  @IsOptional()
  @Expose()
  @Matches(/^(19|20|21)\d{2}-(0[1-9]|1[012])$/)
  startDate?: string | null;

  @ApiPropertyOptional({ example: '2022-07' })
  @IsString()
  @IsOptional()
  @Expose()
  @Matches(/^(19|20|21)\d{2}-(0[1-9]|1[012])$/)
  endDate?: string | null;

  @ApiPropertyOptional({
    example: 'inprogress or done',
    default: 'inprogress',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  experienceStatus?: ExperienceStatus = ExperienceStatus.inprogress;

  @ApiPropertyOptional({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  situation?: string | null;

  @ApiProperty({ example: '개발 시간이 짧아서 빠른 기간 내에 런칭을 완료해야 했음' })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  task?: string | null;

  @ApiPropertyOptional({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  action?: string | null;

  @ApiPropertyOptional({ example: '4개월만에 출시를 성공하게 됨' })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  result?: string | null;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  userId: number;

  // experienceInfo
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  experienceInfoId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  experienceId: number;

  @ApiPropertyOptional({
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  motivation?: string | null;

  @ApiPropertyOptional({
    example: 'UI/UX 디자이너',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  experienceRole?: string | null;

  @ApiPropertyOptional({
    example: '역량 활용',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(100)
  utilization?: string | null;

  @ApiPropertyOptional({
    example: 'AI 분석',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @MaxLength(300)
  analysis?: string | null;
}
