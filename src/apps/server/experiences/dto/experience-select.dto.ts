import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ExperinceDto } from './experience.dto';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';

/**
 * select로 가져올 때는 모든 값들이 optional로 들어가기에 전부 optional인 dto를 따로 만들었습니다.
 */
export class ExperienceSelectDto extends PickType(ExperinceDto, [
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
  @ApiPropertyOptional({ example: 1 })
  @IsOptionalNumber()
  id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptionalNumber()
  experienceInfoId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptionalNumber()
  userId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptionalNumber()
  experienceId?: number;
}
