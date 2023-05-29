import { ApiPropertyOptional } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';

export class CreateExperienceInfoReqDto {
  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsOptionalString(0, 100)
  title: string;

  @ApiPropertyOptional({ example: '2022-01' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  startDate: string;

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  endDate: string;

  @ApiPropertyOptional({
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsOptionalString(0, 100)
  motivation: string;

  @ApiPropertyOptional({
    example: 'UI/UX 디자이너',
  })
  @IsOptionalString(0, 100)
  experienceRole: string;
}
