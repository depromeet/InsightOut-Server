import { ApiPropertyOptional } from '@nestjs/swagger';
import { Experience, ExperienceInfo } from '@prisma/client';
import { Matches } from 'class-validator';
import { dateValidation } from '🔥apps/server/common/consts/date-validation.const';
import { IsOptionalString } from '🔥apps/server/common/decorators/validation/isOptionalString.decorator';

export class UpsertExperienceReqDto {
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
    example: '개발자와 협업 역량을 기르기 위해 하게 됨',
  })
  @IsOptionalString(0, 100)
  motivation?: string;

  @ApiPropertyOptional({
    example: '개발자와 협업이 많기로 알고 있는데 커뮤니케이션 역량을 발휘해 목표 일정에 맞게 일을 빠르고 정확하게 할 수 있을 것',
  })
  @IsOptionalString(0, 100)
  utilization?: string;

  @ApiPropertyOptional({
    example: '저는 UX 디자인 직무에 지원하려는 [이름 입니다.]...~',
  })
  @IsOptionalString(0, 100)
  analysis?: string;

  public compareProperty(experience: Experience & { ExperienceInfo?: ExperienceInfo }) {
    console.log('experience', experience);
    if (this.title) experience.title = this.title;
    if (this.startDate) experience.startDate = new Date(this.startDate);
    if (this.endDate) experience.endDate = new Date(this.endDate);
    if (this.situation) experience.situation = this.situation;
    if (this.task) experience.task = this.task;
    if (this.action) experience.action = this.action;
    if (this.result) experience.result = this.result;
    if (this.motivation) experience.ExperienceInfo.motivation = this.motivation;
    if (this.utilization) experience.ExperienceInfo.utilization = this.utilization;
    if (this.analysis) experience.ExperienceInfo.analysis = this.analysis;
    console.log('experience222', experience);
    return experience;
  }
}
