import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { PaginationOptionsDto } from '📚libs/pagination/pagination-option.dto';
import { OrderBy } from '📚libs/pagination/pagination.type';

export class GetExperienceRequestQueryDto extends PaginationOptionsDto {
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
    description:
      '경험 카드에서 situation을 가져올지에 대한 filter query입니다. true를 입력하면, 응답에 situation이 추가되고 입력하지 않거나 false를 입력하면, 응답에 situation이 제외됩니다.',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Transform((_) => {
    return _.obj.situation === 'true';
  })
  situation?: boolean;

  @ApiPropertyOptional({
    description:
      '경험 카드에서 task를 가져올지에 대한 filter query입니다. true를 입력하면, 응답에 task가 추가되고 입력하지 않거나 false를 입력하면, 응답에 task가 제외됩니다.',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Transform((_) => {
    return _.obj.task === 'true';
  })
  task?: boolean;

  @ApiPropertyOptional({
    description:
      '경험 카드에서 action을 가져올지에 대한 filter query입니다. true를 입력하면, 응답에 action이 추가되고 입력하지 않거나 false를 입력하면, 응답에 action이 제외됩니다.',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Transform((_) => {
    return _.obj.action === 'true';
  })
  action?: boolean;

  @ApiPropertyOptional({
    description:
      '경험 카드에서 result를 가져올지에 대한 filter query입니다. true를 입력하면, 응답에 result가 추가되고 입력하지 않거나 false를 입력하면, 응답에 result가 제외됩니다.',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Transform((_) => {
    return _.obj.result === 'true';
  })
  result?: boolean;

  toRequestDto(this: GetExperienceRequestQueryDto): GetExperienceRequestQueryDtoWithPagination {
    const { criteria, order, take, page, skip, ...getExperienceRequestQueryDto } = this;
    const pagination = { criteria, order, take, page, skip };
    return { pagination, ...getExperienceRequestQueryDto };
  }
}

export type GetExperienceRequestQueryDtoWithPagination = {
  capabilityId?: number;
  situation?: boolean;
  task?: boolean;
  action?: boolean;
  result?: boolean;
  pagination: {
    criteria: string;
    order: OrderBy;
    take: number;
    page: number;
    skip: number;
  };
};
