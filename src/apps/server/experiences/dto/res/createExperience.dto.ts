import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { dateValidation } from '🔥apps/server/common/consts/dateValidation.const';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validations/isCustomNumber.decorator';
import { IsOptionalString } from '🔥apps/server/common/decorators/validations/isCustomString.decorator';

export class CreateExperienceInfoResponseDto {
  @Exclude() private _experienceInfoId: number;
  @Exclude() private _experienceRole: string;
  @Exclude() private _motivation: string;
  @Exclude() private _analysis: string;

  constructor(data: ExperienceInfo) {
    this._experienceInfoId = data.id;
    this._experienceRole = data.experienceRole;
    this._motivation = data.motivation;
    this._analysis = data.analysis;
  }

  set setExperienceInfoId(experienceInfoId: number) {
    this._experienceInfoId = experienceInfoId;
  }

  set setMotivation(motivation: string) {
    this._motivation = motivation;
  }

  set setExperienceRole(experienceRole: string) {
    this._experienceRole = experienceRole;
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
    example: null,
  })
  @IsOptionalString(0, 100)
  get motivation(): string {
    return this._motivation;
  }

  @ApiPropertyOptional({
    example: null,
  })
  @IsOptionalString(0, 100)
  get experienceRole(): string {
    return this._experienceRole;
  }

  @ApiPropertyOptional({
    example: null,
  })
  @IsOptionalString(0, 100)
  get analysis(): string {
    return this._analysis;
  }
}

export class CreateExperienceDto {
  @Exclude() private readonly _experienceId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _situation: string;
  @Exclude() private readonly _task: string;
  @Exclude() private readonly _action: string;
  @Exclude() private readonly _result: string;
  @Exclude() private readonly _startDate: Date;
  @Exclude() private readonly _endDate: Date;
  @Exclude() private readonly _experienceStatus: ExperienceStatus;
  @Exclude() private readonly _experienceInfo: CreateExperienceInfoResponseDto;

  constructor(experience: Experience, experienceInfo: ExperienceInfo) {
    this._experienceId = experience.id;
    this._title = experience.title;
    this._startDate = experience.startDate;
    this._endDate = experience.endDate;
    this._situation = experience.situation;
    this._task = experience.task;
    this._action = experience.action;
    this._result = experience.result;
    this._experienceStatus = experience.experienceStatus;
    this._experienceInfo = new CreateExperienceInfoResponseDto(experienceInfo);
  }

  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  get experienceId(): number {
    return this._experienceId;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 100)
  get title(): string {
    return this._title;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get startDate(): Date {
    return this._startDate;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  get endDate(): Date {
    return this._endDate;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 100)
  get situation(): string {
    return this._situation;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 100)
  get task(): string {
    return this._task;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 100)
  get action(): string {
    return this._action;
  }

  @ApiPropertyOptional({ example: null })
  @IsOptionalString(0, 100)
  get result(): string {
    return this._result;
  }
  @ApiPropertyOptional({
    example: ExperienceStatus.INPROGRESS,
    default: ExperienceStatus.INPROGRESS,
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  @Expose()
  get experienceStatus(): ExperienceStatus {
    return this._experienceStatus;
  }

  @ApiProperty({ type: CreateExperienceInfoResponseDto })
  @Expose()
  get experienceInfo(): CreateExperienceInfoResponseDto {
    return this._experienceInfo;
  }
}
