import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KeywordType } from '@prisma/client';
import { ExperienceCardType } from '🔥apps/server/experiences/types/experience-card.type';

class ExperienceInfo {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  analysis: string;
}

class Capability {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  keyword: string;

  @IsString()
  @IsEnum(KeywordType)
  @IsNotEmpty()
  keywordType: KeywordType;
}

class ExperienceCapability {
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => Capability)
  Capability: Capability;
}

class AiResumeCapability {
  @IsArray()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => Capability)
  Capability: Capability;
}

class AiResume {
  @IsString()
  @IsNotEmpty()
  @MaxLength(700)
  content: string;

  @IsNotEmpty()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => AiResumeCapability)
  AiResumeCapability: AiResumeCapability[];
}

class AiRecommendQuestion {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  title: string;
}

export class PromptSummaryResDto {
  @Exclude() _summaryKeywords: string[];
  @Exclude() _title: string;
  @Exclude() _ExperienceInfo: ExperienceInfo;
  @Exclude() _ExperienceCapability: ExperienceCapability[];
  @Exclude() _AiResume: AiResume;
  @Exclude() _AiRecommendQuestion: AiRecommendQuestion[];

  constructor(experienceCardInfo: ExperienceCardType) {
    this._summaryKeywords = experienceCardInfo.summaryKeywords;
    this._title = experienceCardInfo.title;
    this._ExperienceInfo = experienceCardInfo.ExperienceInfo;
    this._ExperienceCapability = experienceCardInfo.ExperienceCapability;
    this._AiResume = experienceCardInfo.AiResume;
    this._AiRecommendQuestion = experienceCardInfo.AiRecommendQuestion;
  }

  @Expose()
  @IsString({ each: true })
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(0)
  @ApiProperty({
    example: ['개발', '출시'],
  })
  get summaryKeywords(): string[] {
    return this._summaryKeywords;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(0)
  @ApiProperty({ example: '00직무 디자인 인턴' })
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    example: { analysis: '와우! 짧은 기간에 출시 성공은 놀라운 결과예요! 미래를 위한 격려와 긍정적인 피드백이 필요해보입니다!축하합니다!' },
  })
  get ExperienceInfo(): ExperienceInfo {
    return this._ExperienceInfo;
  }

  @Expose()
  @ApiProperty({
    example: [
      {
        Capability: {
          keyword: '협업',
          keywordType: 'USER',
        },
      },
      {
        Capability: {
          keyword: '빠른 기간 내 개발',
          keywordType: 'USER',
        },
      },
    ],
  })
  get ExperienceCapability(): ExperienceCapability[] {
    return this._ExperienceCapability;
  }

  @Expose()
  @ApiProperty({
    example: [
      {
        content:
          '제가 지금까지 경험한 가장 큰 도전 중 하나는 개발당시 빠른 기간 내 출시를 완료해야 한다는 것이었습니다. 다행히도, 저는 개발자와의 협업 능력을 쌓기 위해 IT 동아리에 참여하였고, 이 경험이 이번 도전을 극복하는데 매우 유용했습니다.\n\n처음에는 개발 기간이 짧아 런칭을 완료하기가 매우 어려울 것이라고 생각했습니다. 그러나, 저와 동료 개발자들은 함께 협업하여 각자의 역할을 분담하고 일정을 조율하여 작업을 최대한 효율적으로 수행했습니다. 이를 통해 개발 기간 내에 기능 구현을 완료할 수 있었습니다.\n\n또한, 저와 동료들은 매일 업무 진행 상황을 대화하여 서로의 일정이나 어려움이 있는 부분을 공유했습니다. 이를 통해 각자의 역할을 명확히 인지하면서 작업이 수월했고, 동시에 문제가 발생하면 빠르게 대처할 수 있었습니다.\n\n최종적으로, 저희 팀은 빠른 기간 내에 개발을 완료하고, 4개월 만에 성공적으로 출시할 수 있었습니다. 이 경험은 협업 능력뿐만 아니라 프로젝트 관리 능력, 문제해결 능력 등을 기를 수 있는 좋은 기회였습니다.\n\n앞으로도, 제가 지원하는 회사에서는 빠른 기간 내에 개발을 완료할 수 있는 능력과 협업 능력을 발휘하여 회사의 발전에 기여하고자 합니다. 이전의 경험을 통해 저는 동료 개발자와 함께 협업하여 어려움을 극복할 수 있고, 아이디어를 구체화하여 높은 퀄리티의 기능을 개발할 수 있다는 것을 보여 드릴 수 있습니다.',
        AiResumeCapability: [
          {
            Capability: {
              keyword: '협업',
              keywordType: 'AI',
            },
          },
          {
            Capability: {
              keyword: '빠른 기간 내 개발',
              keywordType: 'AI',
            },
          },
        ],
      },
    ],
  })
  get AiResume(): AiResume {
    return this._AiResume;
  }

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 24,
        title: '당신이 개발하고 출시한 제품 중에서 특별히 자신 있는 제품이 무엇인지, 그 이유와 함께 알려주세요',
      },
      {
        id: 25,
        title: '어떤 기술적인 어려움이 있었을 때, 개발 과정에서 해결한 방법과 그 결과에 대해 이야기해 주세요.',
      },
      {
        id: 26,
        title: '새로운 제품을 출시할 때, 이를 위해 어떤 기획과 마케팅 전략을 세웠는지 자세히 알려주세요.',
      },
    ],
  })
  get AiRecommendQuestion(): AiRecommendQuestion[] {
    return this._AiRecommendQuestion;
  }
}
