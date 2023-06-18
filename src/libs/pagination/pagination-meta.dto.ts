import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDtoParameters } from '📚libs/pagination/pagination.type';

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
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
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
