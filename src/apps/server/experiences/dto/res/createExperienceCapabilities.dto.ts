import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateExperienceCapabilitiesDto {
  @Exclude() _count: number;

  constructor(count: number) {
    this._count = count;
  }

  @ApiProperty({ example: 4, description: '생성된 경험 카드의 개수를 의미합니다.' })
  @Expose()
  @IsNotEmpty()
  @IsInt()
  get count(): number {
    return this._count;
  }
}

export class CreateExperienceCapabillitiesNotFoundErrorResDto {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'NotFoundException' })
  title: string;
  @ApiProperty({
    example: '문제해결역량 해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다',
  })
  message: string;
}
