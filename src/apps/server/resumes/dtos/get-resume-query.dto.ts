import { GetFilterSortQueryRequestDto } from '@apps/server/common/dtos/get-filter-sort-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetResumeRequestQueryDto extends GetFilterSortQueryRequestDto {
  @ApiPropertyOptional({
    description: '필터링할 폴더 제목',
    example: '디프만 자기소개서',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  filter?: string;
}
