import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';

export class UpsertExperienceInfoResDto {
  @Exclude() private _experienceInfoId: number;
  @Exclude() private _experienceRole: string;
  @Exclude() private _motivation: string;
  @Exclude() private _utilization: string;
  @Exclude() private _analysis: string;

  set setExperienceInfoId(experienceInfoId: number) {
    this._experienceInfoId = experienceInfoId;
  }

  set setMotivation(motivation: string) {
    this._motivation = motivation;
  }

  set setExperienceRole(experienceRole: string) {
    this._experienceRole = experienceRole;
  }

  set setUtilization(utiliaztion: string) {
    this._utilization = utiliaztion;
  }

  set setAnalysis(analysis: string) {
    this._analysis = analysis;
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

  @ApiPropertyOptional({
    example: '개발자와 협업이 많기로 알고 있는데 커뮤니케이션 역량을 발휘해 목표 일정에 맞게 일을 빠르고 정확하게 할 수 있을 것',
  })
  @IsOptionalString(0, 100)
  get utilization(): string {
    return this._utilization;
  }

  @ApiPropertyOptional({
    example: '저는 UX 디자인 직무에 지원하려는 [이름 입니다.]...~',
  })
  @IsOptionalString(0, 100)
  get analysis(): string {
    return this._analysis;
  }
}

export class UpsertExperienceResDto {
  @Exclude() private readonly _experienceId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _situation: string;
  @Exclude() private readonly _task: string;
  @Exclude() private readonly _action: string;
  @Exclude() private readonly _result: string;
  @Exclude() private readonly _startDate: Date;
  @Exclude() private readonly _endDate: Date;
  @Exclude() private readonly _experienceStatus: ExperienceStatus;
  @Exclude() private readonly _experienceInfo: UpsertExperienceInfoResDto;

  constructor(experience: Experience, experienceInfo: ExperienceInfo) {
    this._experienceId = experience.id;
    this._title = experience.title;
    this._startDate = experience.startDate;
    this._endDate = experience.endDate;
    this._situation = experience.situation;
    this._task = experience.task;
    this._action = experience.action;
    this._result = experience.result;

    const experienceInfoRes = new UpsertExperienceInfoResDto();
    experienceInfoRes.setExperienceInfoId = experienceInfo.id;
    experienceInfoRes.setExperienceRole = experienceInfo.experienceRole;
    experienceInfoRes.setMotivation = experienceInfo.motivation;
    experienceInfoRes.setUtilization = experienceInfo.utilization;
    experienceInfoRes.setAnalysis = experienceInfo.analysis;

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
  get startDate(): Date {
    return this._startDate;
  }

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get endDate(): Date {
    return this._endDate;
  }

  @ApiPropertyOptional({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsOptionalString(0, 100)
  get situation(): string {
    return this._situation;
  }

  @ApiPropertyOptional({ example: '개발 기간이 짧아서 빠른 기간 내 런칭을 완료해야 했음.' })
  @IsOptionalString(0, 100)
  get task(): string {
    return this._task;
  }

  @ApiPropertyOptional({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsOptionalString(0, 100)
  get action(): string {
    return this._action;
  }

  @ApiPropertyOptional({ example: '4개월 만에 출시에 성공하게 됨.' })
  @IsOptionalString(0, 100)
  get result(): string {
    return this._result;
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

  @ApiProperty({ type: UpsertExperienceInfoResDto })
  @Expose()
  get experienceInfo(): UpsertExperienceInfoResDto {
    return this._experienceInfo;
  }
}

export class UpsertExperienceInfoUnprocessableErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'UnprocessableEntityException' })
  title: string;
  @ApiProperty({ example: '경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요' })
  message: string;
}

export class AddCapabilityRequestErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'BadRequestException' })
  title: string;
  @ApiProperty({
    example: '문제해결역량 해당 키워드가 이미 존재합니다. 확인 부탁드립니다',
  })
  message: string;
}
