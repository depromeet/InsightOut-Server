import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Capability, Experience, ExperienceInfo, ExperienceStatus, ExperienceSummary } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { getFormattedDate } from '📚libs/utils/date';
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

class _Capability {
  id: number;
  keyword: string;
  userId: number;
}

export class GetExperienceByCapabilityResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title?: string;
  @Exclude() private readonly _situation?: string;
  @Exclude() private readonly _startDate?: string;
  @Exclude() private readonly _endDate?: string;
  @Exclude() private readonly _experienceStatus: ExperienceStatus;
  @Exclude() private readonly _capability?: Omit<Capability, 'userId'>[] | undefined;
  @Exclude() private readonly _aiRecommend: any[]; // AI 역량 키워드
  @Exclude() private readonly _experienceSummary: ExperienceSummary[];

  constructor(
    experience: Experience & {
      User: {
        Capability: Capability[];
      };
    },
  ) {
    this._id = experience.id;
    this._title = experience.title;
    this._situation = experience.situation;
    this._startDate = getFormattedDate(experience.startDate);
    this._endDate = getFormattedDate(experience.endDate);
    this._experienceStatus = experience.experienceStatus;
    this._capability = experience.User.Capability.map((capability) => {
      return { id: capability.id, keyword: capability.keyword };
    });
    // this._aiRecommend =
    // this._experienceSummary =
  }

  @Expose()
  @ApiProperty({
    description: '경험카드 id',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험카드 제목',
    example: '디프만 13기 UX/UI 디자이너',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  get title(): string | undefined {
    return this._title;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 분해 S에 속하는 situation 내용',
    example: '디자이너가 한 명 나간 고독과 싸움',
    type: String,
  })
  @IsString()
  @IsOptional()
  get situation(): string | undefined {
    return this._situation;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 시작 연월. 경험을 처음 시작한 일자를 나타냅니다. YYYY-MM의 string을 반환합니다.',
    example: '2023-04',
  })
  @IsString()
  @IsOptional()
  @Matches(dateValidation.YYYY_MM)
  get startDate(): string | undefined {
    return this._startDate;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 종료 연월. 경험을 종료한 일자를 나타냅니다. YYYY-MM의 string을 반환합니다.',
    example: '2023-07',
  })
  @IsString()
  @IsOptional()
  @Matches(dateValidation.YYYY_MM)
  get endDate(): string | undefined {
    return this._endDate;
  }

  @Expose()
  @ApiProperty({
    description: '경험분해의 진척 상황을 나타냅니다. INPROGRESS면 작성중, DONE이면 완료입니다.',
    example: ExperienceStatus.INPROGRESS,
    enum: ExperienceStatus,
    type: ExperienceStatus,
  })
  @IsEnum(ExperienceStatus)
  @IsString()
  @IsNotEmpty()
  get experienceStatus(): ExperienceStatus {
    return this._experienceStatus;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '해당 경험 카드의 역량 키워드입니다.',
    example: {
      id: 1234,
      keyword: '리더십',
    },
    type: _Capability,
    isArray: true,
  })
  get capability(): Omit<Capability, 'userId'>[] | undefined {
    return this._capability;
  }
}

export class GetExperienceNotFoundErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}
