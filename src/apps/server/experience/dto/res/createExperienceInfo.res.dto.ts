import { ApiProperty, PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';
import { Expose } from 'class-transformer';

export class CreateExperienceInfoResDto extends PickType(ExperinceDto, ['experienceInfoId', 'experienceRole', 'motivation'] as const) {}

export class CreateExperienceResDto extends PickType(ExperinceDto, ['experienceId', 'title', 'startDate', 'endDate'] as const) {
  @ApiProperty({ type: CreateExperienceInfoResDto })
  @Expose()
  experienceInfo: CreateExperienceInfoResDto;
}

export class CreateExperienceInfoUnprocessableErrorResDto {
  @ApiProperty({ example: 422 })
  statusCode: number;
  @ApiProperty({ example: 'UnprocessableEntityException' })
  title: string;
  @ApiProperty({ example: '경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요' })
  message: string;
}
