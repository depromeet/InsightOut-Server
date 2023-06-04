import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class CreateExperienceKeywordBodyDto {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}
