import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from '🔥apps/server/common/decorators/validation/isCustomNumber.decorator';

export class ExperienceIdParamReqDto {
  @ApiProperty({ example: 1 })
  @IsNotEmptyNumber()
  experienceId: number;
}
