import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PaginationMetaDto } from '@libs/pagination/paginationMeta.dto';

/**
 * ### Response의 Pagination DTO
 * 응답으로 사용할 pagination dto입니다.
 *
 * @property data 실제 응답으로 받는 데이터입니다.
 * @property meta 해당 페이지네이션의 메타데이터입니다. 페이지, 가져온 개수, 페이지 개수, 아이템 개수, 이전 페이지 존재 유무, 다음 페이지 존재 유무를 반환합니다.
 */
export class PaginationDto<T> {
  @IsArray()
  @ApiProperty({ type: 'generic', isArray: true, description: '실제 데이터입니다.' })
  readonly data: T[];

  @ApiProperty({
    type: PaginationMetaDto,
    description:
      '페이지네이션의 메타데이터로, 현재 페이지, 가져올 데이터 개수, 가져온 데이터 개수, 총 페이지 개수, 이전 페이지 유무, 다음 페이지 유무 값을 가지고 있습니다.',
  })
  readonly meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
