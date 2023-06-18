import { PaginationOptionsDto } from '📚libs/pagination/pagination-option.dto';

export const OrderBy = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type OrderBy = (typeof OrderBy)[keyof typeof OrderBy];

export interface PaginationMetaDtoParameters {
  paginationOptionsDto: PaginationOptionsDto;
  itemCount: number;
}
