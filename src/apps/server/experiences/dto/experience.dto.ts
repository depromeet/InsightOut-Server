import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';

export class ExperinceDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _startDate: string;
  @Exclude() private readonly _endDate: string;
  @Exclude() private readonly _experienceStatus: ExperienceStatus = ExperienceStatus.INPROGRESS;
  @Exclude() private readonly _situation: string;
  @Exclude() private readonly _task: string;
  @Exclude() private readonly _action: string;
  @Exclude() private readonly _result: string;
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _experienceId: number;
  @Exclude() private readonly _experienceInfoId: number;
  @Exclude() private readonly _motivation: string;
  @Exclude() private readonly _experienceRole: string;
  @Exclude() private readonly _utilization: string;
  @Exclude() private readonly _analysis: string;

  // experience
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
  get startDate(): string {
    return this._startDate;
  }

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get endDate(): string {
    return this._endDate;
  }

  @ApiPropertyOptional({
    example: 'inprogress or done',
    default: 'inprogress',
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

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get userId(): number {
    return this._userId;
  }

  // experienceInfo
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
