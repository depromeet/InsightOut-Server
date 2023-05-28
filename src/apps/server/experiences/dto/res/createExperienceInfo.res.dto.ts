import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { Matches } from 'class-validator';

export class CreateExperienceInfoResDto {
  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  experienceInfoId: number;

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

export class CreateExperienceResDto {
  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  experienceId: number;

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

  @ApiProperty({ type: CreateExperienceInfoResDto })
  @Expose()
  experienceInfo: CreateExperienceInfoResDto;
}

export class CreateExperienceInfoUnprocessableErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'UnprocessableEntityException' })
  title: string;
  @ApiProperty({ example: '경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요' })
  message: string;
}
