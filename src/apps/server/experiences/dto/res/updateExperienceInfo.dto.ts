import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';

import { dateValidation } from '@apps/server/common/consts/dateValidation.const';
import { IsOptionalNumber } from '@apps/server/common/decorators/validations/isCustomNumber.decorator';
import { IsOptionalString } from '@apps/server/common/decorators/validations/isCustomString.decorator';

export class UpdateExperienceInfoResponseDto {
  @Exclude() private _experienceInfoId: number;
  @Exclude() private _experienceRole: string;
  @Exclude() private _motivation: string;
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
    example: '저는 UX 디자인 직무에 지원하려는 [이름 입니다.]...~',
  })
  @IsOptionalString(0, 100)
  get analysis(): string {
    return this._analysis;
  }
}

export class UpdateExperienceResDto {
  @Exclude() private readonly _experienceId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _situation: string;
  @Exclude() private readonly _task: string;
  @Exclude() private readonly _action: string;
  @Exclude() private readonly _result: string;
  @Exclude() private readonly _startDate: Date;
  @Exclude() private readonly _endDate: Date;
  @Exclude() private readonly _experienceStatus: ExperienceStatus;
  @Exclude() private readonly _experienceInfo: UpdateExperienceInfoResponseDto;

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

    const experienceInfoRes = new UpdateExperienceInfoResponseDto();
    experienceInfoRes.setExperienceInfoId = experienceInfo.id;
    experienceInfoRes.setExperienceRole = experienceInfo.experienceRole;
    experienceInfoRes.setMotivation = experienceInfo.motivation;
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

  @ApiProperty({ type: UpdateExperienceInfoResponseDto })
  @Expose()
  get experienceInfo(): UpdateExperienceInfoResponseDto {
    return this._experienceInfo;
  }
}

export class UpdateExperienceInfoNotFoundErrorResDto {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundException' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}

export class BadRequestErrorResDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: '데이터 형식이 잘못되었습니다.' })
  title: string;
  @ApiProperty({
    example:
      'action / 124 / action must be a string,action must be shorter than or equal to 100 characters,action must be longer than or equal to 0 characters\nexperienceStatus / INPROGRESS or DONE / experienceStatus must be one of the following values: INPROGRESS, DONE',
  })
  message: string;
}
