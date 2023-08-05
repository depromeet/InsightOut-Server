import { Exclude, Expose } from 'class-transformer';
import { IsNotEmptyNumber } from '🔥apps/server/common/decorators/validations/isCustomNumber.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ExperienceCardType } from '🔥apps/server/experiences/types/experienceCard.type';
import { ExperienceStatus } from '@prisma/client';
export class AiRecommendQuestionResponseDto {
  @Exclude() _id: number;
  @Exclude() _title: string;

  constructor(data: { id: number; title: string }) {
    this._id = data.id;
    this._title = data.title;
  }

  @IsNotEmptyNumber()
  @ApiProperty({ example: 1, description: 'AI가 추천해준 자기소개서 항목 ID입니다.' })
  get id(): number {
    return this._id;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '과거 프로젝트에서 개발과 출시에 대한 역할과 성과에 대해 이야기해 주세요',
    description: 'AI가 추천해준 자기소개서 내용입니다.',
  })
  get title(): string {
    return this._title;
  }
}

export class AiResumeResDto {
  @Exclude() _content: string;
  @Exclude() _AiResumeCapability: string[];

  constructor(data: { content: string; AiResumeCapability: string[] }) {
    this._content = data.content;
    this._AiResumeCapability = data.AiResumeCapability;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '저는 협업능력과 빠른 적응력을 ...', description: 'AI가 추천해준 자기소개서입니다.' })
  get content(): string {
    return this._content;
  }

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['혐업', '리더십'], description: 'AI가 추천해준 keyword 배열입니다.' })
  get AiResumeCapability(): string[] {
    return this._AiResumeCapability;
  }
}

export class GetExperienceCardInfoDto {
  @Exclude() _summaryKeywords: string[];
  @Exclude() _title: string;
  @Exclude() _situation: string;
  @Exclude() _task: string;
  @Exclude() _action: string;
  @Exclude() _result: string;
  @Exclude() _experienceStatus: ExperienceStatus;
  @Exclude() _startDate: Date;
  @Exclude() _endDate: Date;
  @Exclude() _ExperienceInfo: { analysis: string };
  @Exclude() _ExperienceCapability: string[];
  @Exclude() _AiResume: AiResumeResDto;
  @Exclude() _AiRecommendQuestion: AiRecommendQuestionResponseDto[];

  constructor(experienceCardInfo: ExperienceCardType) {
    this._summaryKeywords = experienceCardInfo.summaryKeywords;
    this._title = experienceCardInfo.title;
    this._situation = experienceCardInfo.situation;
    this._task = experienceCardInfo.task;
    this._action = experienceCardInfo.action;
    this._result = experienceCardInfo.result;
    this._startDate = experienceCardInfo.startDate;
    this._experienceStatus = experienceCardInfo.experienceStatus;
    this._endDate = experienceCardInfo.endDate;
    this._ExperienceInfo = experienceCardInfo.ExperienceInfo;
    this._ExperienceCapability = experienceCardInfo.ExperienceCapability;
    this._AiResume = experienceCardInfo.AiResume;
    this._AiRecommendQuestion = experienceCardInfo.AiRecommendQuestion;
  }

  @Expose()
  @ApiProperty({ type: AiRecommendQuestionResponseDto, isArray: true, description: 'AI 추천 자기소개서 재목 배열입니다..' })
  get AiRecommendQuestion(): AiRecommendQuestionResponseDto[] {
    return this._AiRecommendQuestion;
  }
  @Expose()
  @ApiProperty({
    example: { analysis: '와우, 당신의 능력을 보여줘서 놀랐어요! 짧은 기간 내에 출시 성공으로 미래에 대한 가능성이 무궁무진합니다!' },
    description: 'AI가 STAR 요약본입니다.',
  })
  get ExperienceInfo(): { analysis: string } {
    return this._ExperienceInfo;
  }
  @Expose()
  @ApiProperty({ example: ['추진력', '협업'], description: '유저가 선택한 Capability List입니다.' })
  get ExperienceCapability(): string[] {
    return this._ExperienceCapability;
  }
  @Expose()
  @ApiProperty({ type: AiResumeResDto, description: 'AI 추천 자기소개서입니다.' })
  get AiResume(): AiResumeResDto {
    return this._AiResume;
  }
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ example: ['개발', '출시'], description: 'AI가 요약한 키워드 리스트입니다.' })
  get summaryKeywords(): string[] {
    return this._summaryKeywords;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '00직무 디자인 인턴', description: '경험 카드 제목입니다.' })
  get title(): string {
    return this._title;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감', description: 'STAR중 S(상황)입니다.' })
  get situation(): string {
    return this._situation;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '개발 기간이 짧아서 빠른 기간 내 런칭을 완료해야 했음', description: 'STAR중 T(업무)입니다.' })
  get task(): string {
    return this._task;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의', description: 'STAR중 A(행동)입니다.' })
  get action(): string {
    return this._action;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '4개월 만에 출시에 성공하게 됨.', description: 'STAR중 R(결과)입니다.' })
  get result(): string {
    return this._result;
  }

  @Expose()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: '경험의 시작 날짜입니다.' })
  get startDate(): Date {
    return this._startDate;
  }

  @Expose()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: '2022-07-01T00:00:00.000Z', description: '경험의 마지막 날짜입니다.' })
  get endDate(): Date {
    return this._endDate;
  }

  @Expose()
  @ApiProperty({ example: ExperienceStatus.DONE, description: '경험 분해 상태입니다.' })
  get experienceStatus(): ExperienceStatus {
    return this._experienceStatus;
  }
}

export class GetExperienceCardInfoNotFoundErrorResDto {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 experience가 없습니다' })
  message: string;
}
