import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';
import { ExperienceInfoEntity } from '@libs/modules/database/entities/experienceInfo/experienceInfoEntity.interface';

export class ExperienceInfo extends BaseTimeEntity implements ExperienceInfoEntity {
  id: number;
  experienceRole?: string;
  motivation?: string;
  analysis?: string;
  experienceId?: string;

  // Relationship
  Experience: ExperienceEntity;
}
