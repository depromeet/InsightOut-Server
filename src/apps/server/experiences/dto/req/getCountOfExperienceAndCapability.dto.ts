import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCountOfExperienceAndCapabilityQueryRequestDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true, description: '완료된 키워드만 보여주기 위한 플래그입니다.', type: Boolean })
  @Transform((_) => {
    return _.obj.isCompleted === 'true';
  })
  isCompleted = false;
}
