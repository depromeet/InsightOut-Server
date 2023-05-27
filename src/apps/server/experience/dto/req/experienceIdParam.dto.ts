import { PickType } from '@nestjs/swagger';
import { ExperinceDto } from '../experience.dto';

export class ExperienceIdParamReqDto extends PickType(ExperinceDto, ['experienceId'] as const) {}
