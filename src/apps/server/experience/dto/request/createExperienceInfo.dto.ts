import { PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';

export class ProgramUserIdParamDTO extends PickType(ExperinceDto, [
  'title',
  'startDate',
  'endDate',
  'reason',
] as const) {}
