import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetCountOfExperienceAndCapabilityQueryReqDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: '완료된 키워드만 보여주기 위한 플래그입니다.' })
  @Transform((_) => {
    return _.obj.isCompleted === 'true';
  })
  isCompleted: boolean;
}
