import { ExperienceEntity } from '@libs/modules/database/entities/experience/experienceEntity.interface';

export interface ExperienceInfoEntity {
  id: number;
  experienceRole?: string;
  motivation?: string;
  analysis?: string;
  experienceId?: string;

  Experience: ExperienceEntity;
}
