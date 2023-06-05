import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class GetExperienceRequestQueryDto {
  @ApiPropertyOptional({
    description: '역량 키워드 id',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  capabilityId?: number;

  @ApiPropertyOptional({
    description: '가장 최근 경험분해 하나만 가져올지 여부입니다.',
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Transform((_) => {
    return _.obj.last === 'true' ? true : false;
  })
  last?: boolean;
}
