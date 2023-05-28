import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ExperinceDto } from '🔥apps/server/experiences/dto/experience.dto';

export class GetExperienceInfoResDto extends PickType(ExperinceDto, [
  'experienceId',
  'experienceInfoId',
  'experienceRole',
  'experienceStatus',
  'motivation',
  'analysis',
  'utilization',
] as const) {}

export class GetExperienceResDto extends PickType(ExperinceDto, [
  'id',
  'title',
  'startDate',
  'endDate',
  'task',
  'action',
  'situation',
  'result',
] as const) {
  @Expose()
  @ApiProperty({ type: GetExperienceInfoResDto })
  experienceInfo?: Partial<GetExperienceInfoResDto>;
}

export class GetExperienceNotFoundErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}
