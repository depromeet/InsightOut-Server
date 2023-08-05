import { ApiPropertyOptional } from '@nestjs/swagger';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { IsEnum, IsOptional, Matches } from 'class-validator';

import { dateValidation } from '@apps/server/common/consts/dateValidation.const';
import { IsOptionalString } from '@apps/server/common/decorators/validations/isCustomString.decorator';

export class UpdateExperienceRequestDto {
  @ApiPropertyOptional({ example: '00직무 디자인 인턴' })
  @IsOptionalString(0, 100)
  title?: string;

  @ApiPropertyOptional({ example: '2022-01' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  startDate?: string;

  @ApiPropertyOptional({ example: '2022-07' })
  @IsOptionalString(0, 7)
  @Matches(dateValidation.YYYY_MM)
  endDate?: string;

  @ApiPropertyOptional({ example: '개발자와 협업 역량을 쌓기 위해 IT 동아리에 들어감' })
  @IsOptionalString(0, 100)
  situation?: string;

  @ApiPropertyOptional({ example: '개발 기간이 짧아서 빠른 기간 내 런칭을 완료해야 했음.' })
  @IsOptionalString(0, 100)
  task?: string;

  @ApiPropertyOptional({ example: '디자인 시스템 제작, 런칭일 정해서 린하게 개발하는 방법 제의' })
  @IsOptionalString(0, 100)
  action?: string;

  @ApiPropertyOptional({ example: '4개월 만에 출시에 성공하게 됨.' })
  @IsOptionalString(0, 100)
  result?: string;

  @ApiPropertyOptional({
    example: 'UI/UX 디자이너',
  })
  @IsOptionalString(0, 100)
  experienceRole?: string;

  @ApiPropertyOptional({
    example: 'INPROGRESS or DONE',
    default: 'INPROGRESS',
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  experienceStatus: ExperienceStatus;

  @ApiPropertyOptional({
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsOptionalString(0, 100)
  motivation?: string;

  // analysis는 따로 body 값으로 받지 않고 요약 프롬프트가 생성되면 저장됩니다.
  // 따로 데코레이터를 넣지 않습니다.
  analysis?: string;

  // keyowrds는 prisma의 특성상 옵셔널이 존재하지 않습니다. 생성시에는 따로 넣어주지 않아도 되지만 업데이트 시 아래 compareProperty에서는 사용되어야 합니다.
  // 그렇기에 따로 데코레이터로 받지 않고 선언만 해줍니다.
  // 키워드 요약 후 저장할 떄 필요하기 떄문입니다 :)
  summaryKeywords?: string[];

  public compareProperty(experience: Experience & { ExperienceInfo?: ExperienceInfo }) {
    if (this.title) experience.title = this.title;
    if (this.startDate) experience.startDate = new Date(this.startDate);
    if (this.endDate) experience.endDate = new Date(this.endDate);
    if (this.situation) experience.situation = this.situation;
    if (this.task) experience.task = this.task;
    if (this.action) experience.action = this.action;
    if (this.result) experience.result = this.result;
    if (this.summaryKeywords) experience.summaryKeywords = this.summaryKeywords;
    if (this.experienceStatus) experience.experienceStatus = this.experienceStatus;
    if (this.experienceRole) experience.ExperienceInfo.experienceRole = this.experienceRole;
    if (this.motivation) experience.ExperienceInfo.motivation = this.motivation;
    if (this.analysis) experience.ExperienceInfo.analysis = this.analysis;

    return experience;
  }
}
