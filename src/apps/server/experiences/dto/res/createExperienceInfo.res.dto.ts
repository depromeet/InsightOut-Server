import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { Matches } from 'class-validator';
import { Experience, ExperienceInfo } from '@prisma/client';
import { getFormattedDate } from '📚libs/utils/date';

export class CreateExperienceInfoResDto {
  @Exclude() private _experienceInfoId: number;
  @Exclude() private _motivation: string;
  @Exclude() private _experienceRole: string;

  @Expose()
  set setExperienceInfoId(experienceInfoId: number) {
    this._experienceInfoId = experienceInfoId;
  }

  @Expose()
  set setMotivation(motivation: string) {
    this._motivation = motivation;
  }

  @Expose()
  set setExperienceRole(experienceRole: string) {
    this._experienceRole = experienceRole;
  }

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get experienceInfoId(): number {
    return this._experienceInfoId;
  }

  @ApiPropertyOptional({
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsOptionalString(0, 100)
  get motivation(): string {
    return this._motivation;
  }

  @ApiPropertyOptional({
    example: 'UI/UX 디자이너',
  })
  @IsOptionalString(0, 100)
  get experienceRole(): string {
    return this._experienceRole;
  }
}

export class CreateExperienceResDto {
  @Exclude() private readonly _experienceId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _startDate: string;
  @Exclude() private readonly _endDate: string;
  @Exclude() private readonly _experienceInfo: CreateExperienceInfoResDto;

  constructor(experience: Experience, experienceInfo: ExperienceInfo) {
    this._experienceId = experience.id;
    this._title = experience.title;
    this._startDate = getFormattedDate(experience.startDate);
    this._endDate = getFormattedDate(experience.endDate);

    const experienceInfoRes = new CreateExperienceInfoResDto();
    experienceInfoRes.setExperienceInfoId = experienceInfo.experienceInfoId;
    experienceInfoRes.setExperienceRole = experienceInfo.experienceRole;
    experienceInfoRes.setMotivation = experienceInfo.motivation;

    this._experienceInfo = experienceInfoRes;
  }

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get experienceId(): number {
    return this._experienceId;
  }

  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsOptionalString(0, 100)
  get title(): string {
    return this._title;
  }

  @ApiPropertyOptional({ example: '2022-01' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get startDate(): string {
    return this._startDate;
  }

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get endDate(): string {
    return this._endDate;
  }

  @ApiProperty({ type: CreateExperienceInfoResDto })
  @Expose()
  get experienceInfo(): CreateExperienceInfoResDto {
    return this._experienceInfo;
  }
}

export class CreateExperienceInfoUnprocessableErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'UnprocessableEntityException' })
  title: string;
  @ApiProperty({ example: '경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요' })
  message: string;
}
