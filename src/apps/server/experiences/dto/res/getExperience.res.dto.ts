import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';

export class GetExperienceInfoResDto {
  @Exclude() _experienceInfoId: number;
  @Exclude() _experienceId: number;
  @Exclude() _motivation: string;
  @Exclude() _experienceRole: string;
  @Exclude() _utilization: string;
  @Exclude() _analysis: string;

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get experienceInfoId(): number {
    return this._experienceInfoId;
  }

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get experienceId(): number {
    return this._experienceId;
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

  @ApiPropertyOptional({
    example: '역량 활용',
  })
  @IsOptionalString(0, 100)
  get utilization(): string {
    return this._utilization;
  }

  @ApiPropertyOptional({
    example: 'AI 분석',
  })
  @IsOptionalString(0, 100)
  get analysis(): string {
    return this._analysis;
  }
}

export class GetExperienceResDto {
  @Exclude() _id: number;
  @Exclude() _title: string;
  @Exclude() _startDate: Date;
  @Exclude() _endDate: Date;
  @Exclude() _experienceStatus: ExperienceStatus;
  @Exclude() _situation: string;
  @Exclude() _task: string;
  @Exclude() _action: string;
  @Exclude() _result: string;

  constructor(
    experience: Partial<
      Experience & {
        experienceInfo?: ExperienceInfo;
      }
    >,
  ) {
    this._id = experience.id;
    this._title = experience.title;
    this._startDate = experience.startDate;
    this._endDate = experience.endDate;
    this._experienceStatus = experience.experienceStatus;
    this._situation = experience.situation;
    this._task = experience.task;
    this._action = experience.action;
    this._result = experience.result;
    this.experienceInfo = experience.experienceInfo;
  }

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get id(): number {
    return this._id;
  }

  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsOptionalString(0, 100)
  get title(): string {
    return this._title;
  }

  @ApiPropertyOptional({ example: '2022-01' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get startDate(): Date {
    return this._startDate;
  }

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get endDate(): Date {
    return this._endDate;
  }

  @ApiPropertyOptional({
    example: 'INPROGRESS or DONE',
    default: 'INPROGRESS',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  get experienceStatus(): ExperienceStatus {
    return this._experienceStatus;
  }

  @ApiPropertyOptional({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsOptionalString(0, 100)
  get situation(): string {
    return this._situation;
  }

  @ApiProperty({ example: '개발 시간이 짧아서 빠른 기간 내에 런칭을 완료해야 했음' })
  @IsOptionalString(0, 100)
  get task(): string {
    return this._task;
  }

  @ApiPropertyOptional({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsOptionalString(0, 100)
  get action(): string {
    return this._action;
  }

  @ApiPropertyOptional({ example: '4개월만에 출시를 성공하게 됨' })
  @IsOptionalString(0, 100)
  get result(): string {
    return this._result;
  }

  @Expose()
  @ApiProperty({ type: GetExperienceInfoResDto })
  experienceInfo?: Partial<GetExperienceInfoResDto>;
}

export class GetExperienceNotFoundErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}
