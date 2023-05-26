import { Sort } from '@apps/server/common/enums/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetFilterSortQueryRequestDto {
  // 공통 필터 추가하기
  // filter: Filter;

  @ApiPropertyOptional({
    description: '정렬 기준',
    example: Sort.EXPERIENCE,
  })
  @IsEnum(Sort)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  sort: Sort;
}
