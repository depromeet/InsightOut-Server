import { PaginationOptionsDto } from '📚libs/pagination/paginationOption.dto';

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

/**
 * ### 정렬 기준
 *
 * createdAt은 생성일자 순이며, startDate는 경험시간 순입니다.
 *
 * 이때, 기본적인 정렬은 createdAt을 기준으로 하며 DESC 순서로 가져오는 것입니다. 작성일자 순이 존재하지만, 별도로 화면에 드러나지 않습니다.
 */
export const OrderCriteria = {
  createdAt: 'createdAt',
  startDate: 'startDate',
} as const;

export type OrderCriteria = (typeof OrderCriteria)[keyof typeof OrderCriteria];
