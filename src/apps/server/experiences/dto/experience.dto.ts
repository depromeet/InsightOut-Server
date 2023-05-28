import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, Matches, MaxLength } from 'class-validator';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';

export class ExperinceDto {
  // experience
  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  id: number;

  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsOptionalString(0, 100)
  title?: string;

  @ApiPropertyOptional({ example: '2022-01' })
  @IsOptionalString(0, 7)
  @Matches(/^(19|20|21)\d{2}-(0[1-9]|1[012])$/)
  startDate?: string;

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(/^(19|20|21)\d{2}-(0[1-9]|1[012])$/)
  endDate?: string;

  @ApiPropertyOptional({
    example: 'inprogress or done',
    default: 'inprogress',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  experienceStatus?: ExperienceStatus = ExperienceStatus.inprogress;

  @ApiPropertyOptional({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsOptionalString(0, 100)
  situation?: string;

  @ApiProperty({ example: '개발 시간이 짧아서 빠른 기간 내에 런칭을 완료해야 했음' })
  @IsOptionalString(0, 100)
  task?: string;

  @ApiPropertyOptional({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsOptionalString(0, 100)
  action?: string;

  @ApiPropertyOptional({ example: '4개월만에 출시를 성공하게 됨' })
  @IsOptionalString(0, 100)
  result?: string;

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  userId: number;

  // experienceInfo
  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  experienceInfoId: number;

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  experienceId: number;

  @ApiPropertyOptional({
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsOptionalString(0, 100)
  motivation?: string;

  @ApiPropertyOptional({
    example: 'UI/UX 디자이너',
  })
  @IsOptionalString(0, 100)
  experienceRole?: string;

  @ApiPropertyOptional({
    example: '역량 활용',
  })
  @IsOptionalString(0, 100)
  utilization?: string;

  @ApiPropertyOptional({
    example: 'AI 분석',
  })
  @IsOptionalString(0, 100)
  analysis?: string;
}
