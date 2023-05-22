import { ApiProperty } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExperinceDto {
  // experience

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number | null;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceInfoId?: number | null;

  @ApiProperty({ required: false, example: '00직무 디자인 인턴' })
  @IsString()
  @IsOptional()
  @Expose()
  title?: string | null;

  @ApiProperty({ required: false, example: '2022-01' })
  @IsString()
  @IsOptional()
  @Expose()
  startDate?: string | null;

  @ApiProperty({ required: false, example: '2022-07' })
  @IsString()
  @IsOptional()
  @Expose()
  endDate?: string | null;

  @ApiProperty({
    required: false,
    example: 'inprogress or done',
    default: 'inprogress',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  experienceStatus?: ExperienceStatus = ExperienceStatus.inprogress;

  @ApiProperty({ required: false, example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsString()
  @IsOptional()
  @Expose()
  situation?: string | null;

  @ApiProperty({ required: false, example: '개발 시간이 짧아서 빠른 기간 내에 런칭을 완료해야 했음' })
  @IsString()
  @IsOptional()
  @Expose()
  task?: string | null;

  @ApiProperty({ required: false, example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsString()
  @IsOptional()
  @Expose()
  action?: string | null;

  @ApiProperty({ required: false, example: '4개월만에 출시를 성공하게 됨' })
  @IsString()
  @IsOptional()
  @Expose()
  result?: string | null;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  userId?: number | null;

  // experienceInfo

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceId?: number | null;

  @ApiProperty({
    required: false,
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsString()
  @IsOptional()
  @Expose()
  motivate?: string | null;

  @ApiProperty({
    required: false,
    example: 'UI/UX 디자이너',
  })
  @IsString()
  @IsOptional()
  @Expose()
  experienceRole?: string | null;

  @ApiProperty({
    required: false,
    example: '역량 활용',
  })
  @IsString()
  @IsOptional()
  @Expose()
  utilization?: string | null;

  @ApiProperty({
    required: false,
    example: 'AI 분석',
  })
  @IsString()
  @IsOptional()
  @Expose()
  analysis?: string | null;
}
