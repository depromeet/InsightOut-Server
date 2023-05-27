import { ApiProperty, PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';

export class CreateExperienceInfoResDto extends PickType(ExperinceDto, [
  'experienceId',
  'experienceInfoId',
  'title',
  'startDate',
  'endDate',
  'experienceRole',
  'motivate',
] as const) {}

export class CreateExperienceInfoUnprocessableErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'UnprocessableEntityException' })
  title: string;
  @ApiProperty({ example: '경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요' })
  message: string;
}
