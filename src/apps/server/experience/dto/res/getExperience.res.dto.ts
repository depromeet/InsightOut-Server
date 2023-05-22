import { ApiProperty, PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';

export class GetExperienceResDto extends PickType(ExperinceDto, [
  'experienceId',
  'experienceInfoId',
  'title',
  'startDate',
  'endDate',
  'experienceRole',
  'motivate',
] as const) {}

export class GetExperienceNotFoundErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundError' })
  title: string;
  @ApiProperty({ example: '해당 ID의 경험카드는 존재하지 않습니다.' })
  message: string;
}
