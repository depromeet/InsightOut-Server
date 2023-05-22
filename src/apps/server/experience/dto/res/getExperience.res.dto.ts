import { ApiProperty, PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';
import { Expose } from 'class-transformer';

export class GetExperienceInfoResDto extends PickType(ExperinceDto, [
  'experienceId',
  'experienceInfoId',
  'experienceRole',
  'experienceStatus',
  'motivate',
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
  @ApiProperty({ type: GetExperienceInfoResDto })
  @Expose()
  experienceInfo?: GetExperienceInfoResDto;
}

export class GetExperienceNotFoundErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}
