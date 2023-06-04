import { Injectable } from '@nestjs/common';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';

@Injectable()
export class CollectionsService {
  constructor(private readonly experienceRepository: ExperienceRepository, private readonly resumeRepository: ResumeRepository) {}
}
