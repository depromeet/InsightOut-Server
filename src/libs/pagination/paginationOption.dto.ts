import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { OrderBy, OrderCriteria } from '@libs/pagination/pagination.type';

const criteriaDiscription = `
### 데이터를 가져오는 기준

원하는 기준을 입력해주세요. 정렬 기준은 API마다 다르므로, 위에 있는 설명을 참고하여 입력해주세요.
`;

const orderDiscription = `
### 데이터를 가져오는 순서

asc는 오름차순이고, desc는 내림차순입니다.\n
최신순으로 가져오고자 한다면, criteria는 createdAt으로 설정하고 order는 desc로 설정해 주세요.
`;

/**
 * ### Request의 Pagination Option DTO
 *
 * Request에서 pagination이 필요할 경우 사용하는 DTO입니다.
 * 해당 DTO를 필요한 DTO에서 extends로 상속받아서 사용해주세요.
 *
 * @property criteria 정렬 기준입니다.
 * @property order 정렬 순서입니다.
 * @property page 가져올 페이지 번호입니다.
 * @property take 페이지 당 가져올 데이터 개수입니다.
 * @property skip 해당 페이지의 데이터를 가져오기 위해 사용할 sql skip 값입니다.
 */
export class PaginationOptionsDto {
  @ApiPropertyOptional({
    description: criteriaDiscription,
    example: OrderCriteria.createdAt,
    default: OrderCriteria.createdAt,
    type: OrderCriteria,
    enum: OrderCriteria,
  })
  @IsString()
  @IsEnum(OrderCriteria)
  @IsNotEmpty()
  @IsOptional()
  readonly criteria?: OrderCriteria = OrderCriteria.createdAt;

  @ApiPropertyOptional({ description: orderDiscription, enum: OrderBy, default: OrderBy.desc })
  @IsEnum(OrderBy)
  @IsOptional()
  readonly order?: OrderBy = OrderBy.desc;

  @ApiPropertyOptional({
    description: '### 가져올 페이지',
    minimum: 1,
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: '### 페이지 당 가져올 데이터 개수',
    minimum: 1,
    maximum: 50,
    default: 3,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 3;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
