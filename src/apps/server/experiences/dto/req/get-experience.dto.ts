import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
// import { PaginationOptionsDto } from '📚libs/pagination/pagination-option.dto';

// TODO Pagination 상속받아서 속성을 부여받고, Controller에서 dto wrapping하기
// export class GetExperienceRequestQueryDto extends PaginationOptionsDto {
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
    return _.obj.situation === 'true' ? true : false;
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
    return _.obj.task === 'true' ? true : false;
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
    return _.obj.action === 'true' ? true : false;
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
    return _.obj.result === 'true' ? true : false;
  })
  result?: boolean;
}
