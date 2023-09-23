import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDtoParameters } from '@libs/pagination/pagination.type';

/**
 * ### 페이지네이션 메타데이터
 *
 * 해당 페이지네이션의 메타데이터입니다.
 *
 * @property `page` 가져올 페이지 번호입니다.
 * @property `take` 페이지 당 가져올 데이터 개수입니다.
 * @property `itemCount` 해당 페이지에서의 데이터 개수입니다.
 * @property `pageCount` 총 페이지 개수입니다.
 * @property `hasPreviousPage` 이전 페이지가 존재하는지에 대한 유무입니다.
 * @property `hasNextPage` 다음 페이지가 존재하는지에 대한 유무입니다.
 */
export class PaginationMetaDto {
  @ApiProperty({ type: Number, description: 'API 요청에 사용한 페이지 정보입니다.', example: 1 })
  readonly page: number;

  @ApiProperty({ type: Number, description: 'API 요청에 사용한 페이지 당 조회할 개수입니다.', example: 3 })
  readonly take: number;

  @ApiProperty({ type: Number, description: '해당 API로 요청했을 때 DB에 저장되어 있는 총 아이템 개수입니다.', example: 3 })
  readonly itemCount: number;

  @ApiProperty({ type: Number, description: '총 페이지 개수', example: 3 })
  readonly pageCount: number;

  @ApiProperty({ type: Boolean, description: '이전 페이지 여부', example: false })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ type: Boolean, description: '다음 페이지 여부', example: true })
  readonly hasNextPage: boolean;

  constructor({ paginationOptionsDto, itemCount }: PaginationMetaDtoParameters) {
    this.page = paginationOptionsDto.page;
    this.take = paginationOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
