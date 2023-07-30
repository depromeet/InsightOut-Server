import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Capability, AiRecommendQuestion, AiResumeCapability, Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { getFormattedDate } from '📚libs/utils/date';
import { dateValidation } from '🔥apps/server/common/consts/dateValidation.const';

export class GetExperiencesResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title?: string;
  @Exclude() private readonly _situation?: string;
  @Exclude() private readonly _task?: string;
  @Exclude() private readonly _action?: string;
  @Exclude() private readonly _result?: string;
  @Exclude() private readonly _startDate?: string;
  @Exclude() private readonly _endDate?: string;
  @Exclude() private readonly _experienceStatus: ExperienceStatus;
  @Exclude() private readonly _summaryKeywords?: string[] | undefined;
  @Exclude() private readonly _experienceCapabilityKeywords?: string[] | undefined;
  @Exclude() private readonly _aiRecommendKeywords?: string[] | undefined;
  @Exclude() private readonly _aiAnalysis?: string | undefined;
  @Exclude() private readonly _aiRecommendQuestions?: Partial<AiRecommendQuestion>[] | undefined;

  constructor(
    experience: Partial<Experience> & {
      ExperienceCapabilities: { Capability: Capability }[];
      // AiResumes: { AiResumeCapabilities: AiResumeCapability[] } | { AiResumeCapability: { Capability: Capability }[] };
      AiResume?: { AiResumeCapabilities: AiResumeCapability[] } | { AiResumeCapabilities: { Capability: Capability }[] };
      AiRecommendQuestions: AiRecommendQuestion[];
      ExperienceInfo: ExperienceInfo;
    },
  ) {
    this._id = experience.id;
    this._title = experience.title;
    this._situation = experience.situation;
    this._task = experience.task;
    this._action = experience.action;
    this._result = experience.result;
    this._startDate = experience.startDate ? getFormattedDate(experience.startDate) : null;
    this._endDate = experience.endDate ? getFormattedDate(experience.endDate) : null;
    this._experienceStatus = experience.experienceStatus;
    this._summaryKeywords = experience?.summaryKeywords; // AI 요약 키워드
    this._experienceCapabilityKeywords = experience?.ExperienceCapabilities.map(
      (experienceCapability) => experienceCapability.Capability.keyword,
    ); // 경험 역량 키워드
    this._aiRecommendKeywords =
      experience?.AiResume?.AiResumeCapabilities.map(
        (aiResumeCapability: AiResumeCapability & { Capability: Capability }) => aiResumeCapability.Capability?.keyword,
      ) ?? [];
    this._aiAnalysis = experience.ExperienceInfo?.analysis;
    this._aiRecommendQuestions = experience.AiRecommendQuestions.map((aiRecommendQuestion) => {
      const { createdAt, updatedAt, experienceId, ...restAiRecommendQuestion } = aiRecommendQuestion;
      return restAiRecommendQuestion;
    });

    // this._aiRecommend =
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
    description: '경험 분해 S에 속하는 situation, 상황 내용',
    example: '디프만 13기에 들어갔어요',
    type: String,
  })
  @IsString()
  @IsOptional()
  get situation(): string | undefined {
    return this._situation;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 분해 T에 속하는 task, 문제 내용',
    example: '디자이너가 한 명 나가서 고독과 싸움을 했어요',
    type: String,
  })
  @IsString()
  @IsOptional()
  get task(): string | undefined {
    return this._task;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 분해 A에 속하는 action, 해결 내용',
    example: '위기를 기회로 오히려 좋다는 마음가짐으로 도전했어요',
    type: String,
  })
  @IsString()
  @IsOptional()
  get action(): string | undefined {
    return this._action;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '경험 분해 R에 속하는 result, 결과 내용',
    example: 'insight-out이라는 예쁜 서비스가 탄생했어요',
    type: String,
  })
  @IsString()
  @IsOptional()
  get result(): string | undefined {
    return this._result;
  }

  @Expose()
  @ApiPropertyOptional({
    description:
      '경험 시작 연월. 경험을 처음 시작한 일자를 나타냅니다. YYYY-MM의 string을 반환합니다. 만약 값이 존재하지 않거나 유효하지 않은 포맷이라면 Invald Date라고 전달됩니다.',
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
    description:
      '경험 종료 연월. 경험을 종료한 일자를 나타냅니다. YYYY-MM의 string을 반환합니다. 만약 값이 존재하지 않거나 유효하지 않은 포맷이라면 Invald Date라고 전달됩니다.',
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
    description: '해당 경험 카드의 요약 키워드입니다.',
    example: ['서비스 스토어 런칭, 대상 수상'],
    isArray: true,
    type: String,
  })
  get summaryKeywords(): string[] {
    return this._summaryKeywords;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '해당 경험에서 선택한 직무 역량 키워드입니다.',
    example: ['리더십'],
    isArray: true,
    type: String,
  })
  get experienceCapabilityKeywords(): string[] {
    return this._experienceCapabilityKeywords;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '해당 경험 카드의 AI 추천 키워드입니다.',
    example: ['통찰력', '상황파악'],
    isArray: true,
    type: String,
  })
  get aiRecommendKeywords(): string[] | undefined {
    return this._aiRecommendKeywords;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '해당 경험 카드의 AI 역량 분석입니다.',
    example: `디자이너로서 개발팀과 각각의 전문성을 최대한 활용하여 높은 퀄리티의 앱을 만들어내기 위해 커뮤니케이션 능력을 뽐내셨군요!
    빠른 기간안에 앱 서비스를 런칭해야하는 상황에서 디자인 시스템 제작, 런칭일 정해서
    린하게 개발하는 방법을 제의한 것은 프로젝트 관리 능력의 일환이었습니다.`,
    type: String,
  })
  get aiAnalysis(): string | undefined {
    return this._aiAnalysis;
  }

  @Expose()
  @ApiPropertyOptional({
    description: '해당 경험 카드의 경험과 잘 맞는 자기소개서 문항입니다.',
    example: [
      '본인이 팀 프로젝트에서 어려운 의견 충돌 상황을 어떻게 관리했고, 해결책을 도출하는 과정을 설명해주세요.',
      'Q. 본인이 고객과의 원활한 커뮤니케이션을 통해 성과를 이뤄낸 경험에 대해 알려주세요.',
    ],
    isArray: true,
    type: String,
  })
  get aiRecommendQuestions(): Partial<AiRecommendQuestion>[] | undefined {
    return this._aiRecommendQuestions;
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
