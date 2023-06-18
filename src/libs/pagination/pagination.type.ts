import { PaginationOptionsDto } from '📚libs/pagination/pagination-option.dto';

/**
 * ### 정렬 순서
 *
 * asc는 오름차순이며, desc는 내림차순입니다.
 */
export const OrderBy = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type OrderBy = (typeof OrderBy)[keyof typeof OrderBy];

/**
 * ### Pagination Metadata의 매개변수
 */
export interface PaginationMetaDtoParameters {
  paginationOptionsDto: PaginationOptionsDto;
  itemCount: number;
}
