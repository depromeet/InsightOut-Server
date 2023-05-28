import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from '🔥apps/server/common/decorators/validation/isOptionalNumber.decorator';

export class ExperienceIdParamReqDto {
  @ApiProperty({ example: 1 })
  @IsOptionalNumber()
  experienceId: number;
}
