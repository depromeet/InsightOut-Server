import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ExperinceDto } from './experience.dto';

/**
 * select로 가져올 때는 모든 값들이 optional로 들어가기에 전부 optional인 dto를 따로 만들었습니다.
 */
export class ExperinceSelectDto extends PickType(ExperinceDto, [
  'title',
  'startDate',
  'endDate',
  'situation',
  'task',
  'result',
  'action',
  'experienceStatus',
  'experienceRole',
  'motivation',
  'analysis',
  'utilization',
] as const) {
  // experience
  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number | null;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceInfoId?: number | null;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  userId?: number | null;

  @ApiProperty({ required: false, example: '1' })
  @IsNumber()
  @IsOptional()
  @Expose()
  experienceId?: number | null;
}
