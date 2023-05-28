import { PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';

export class CreateExperienceInfoReqDto extends PickType(ExperinceDto, [
  'title',
  'startDate',
  'endDate',
  'experienceRole',
  'motivation',
] as const) {}