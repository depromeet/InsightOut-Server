import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiResumeDto {
  @Exclude() _id: number;
  @Exclude() _content: string;
  @Exclude() _updatedAt: Date;
  @Exclude() _AiCapabilities: string[];

  constructor(AiResume: { AiResumeCapabilities: { Capability: { keyword: string } }[]; id: number; updatedAt: Date; content: string }) {
    this._id = AiResume.id;
    this._content = AiResume.content;
    this._updatedAt = AiResume.updatedAt;
    this._AiCapabilities = AiResume.AiResumeCapabilities.map((aiResumeCapabilities) => aiResumeCapabilities.Capability.keyword);
  }

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'AI 추천 자기소개서의 Id입니다.' })
  get id(): number {
    return this._id;
  }

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      '협업 능력과 시간 관리\n' +
      '저는 IT 동아리에 가입하여, 개발자들과 함께 협업 역량을 쌓았습니다. 제가 참여한 작업의 산출물 중 하나는 개발 기간이 짧아 빠른 기간 내 런칭을 완료해야 했던 프로젝트였습니다. 이를 성공적으로 수행하기 위해서는 협업 능력과 시간 관리 능력 모두가 요구되었습니다.\n' +
      '우선, 저희 팀은 시간 관리를 위한 계획을 세우기 시작했습니다. 개발의 각 단계에 대해 먼저 분석하고, 예상되는 문제점에 대비하여 최대한의 시간을 확보했습니다. 이를 위해 팀원들과 의견을 교환하며 가장 효율적인 방법을 찾아내었습니다.\n' +
      '그 다음으로는 적극적인 협업을 위한 노력이 필요했습니다. 개인적인 일정보다는 팀의 일정을 우선으로 생각하여, 각자 맡은 역할을 수행하는 동시에 다른 팀원의 일도 이해하고 지원해주었습니다. 또한, 업무 내용에 대한 상호 피드백을 통해 서로의 역할에 대한 이해도를 높였습니다.\n' +
      '위와 같은 노력으로 인해, 저희 팀은 개발 기간이 짧은 동안에도 원활한 협업을 통해 4개월 만에 성공적으로 출시할 수 있었습니다. 이 경험을 통해, 저는 협업 능력과 시간 관리 능력의 중요성을 깨달았습니다. 앞으로도 저는 팀원들과의 적극적인 협업과 효율적인 시간 관리로 성공적인 결과를 이루기 위해 노력할 것입니다.',
  })
  get content(): string {
    return this._content;
  }

  @IsNotEmpty()
  @IsDate()
  @Expose()
  @ApiProperty({ example: '2023-06-18T13:14:03.698Z', description: 'update된 날짜' })
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @ApiProperty({ example: ['협업 능력', '추진력'], description: 'AI 추천 키워드 종류가 들어있는 배열입니다.' })
  get AiCapabilities(): string[] {
    return this._AiCapabilities;
  }
}

export class GetAiResumeResDto {
  @Exclude() _AiResumes: AiResumeDto[];
  @Exclude() _availableKeywords: string[];

  constructor(AiResumeResDtoArr: AiResumeDto[], availableKeywords: string[]) {
    this._AiResumes = AiResumeResDtoArr;
    this._availableKeywords = availableKeywords;
  }

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ example: ['추진력', '협업'] })
  get availableKeywords(): string[] {
    return this._availableKeywords;
  }

  @IsArray()
  @Type(() => AiResumeDto)
  @ValidateNested({ each: true })
  @Expose()
  @ApiProperty({ type: AiResumeDto, isArray: true })
  get AiResumes(): AiResumeDto[] {
    return this._AiResumes;
  }
}
