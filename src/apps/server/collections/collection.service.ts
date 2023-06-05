import { Injectable } from '@nestjs/common';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { GetCountOfExperienceAndResumeResponseDto } from '🔥apps/server/collections/dtos/get-count-of-experience-and-resume.dto';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly capabilityRepository: CapabilityRepository,
  ) {}

  public async getCountOfExperienceAndResume(userId: number): Promise<GetCountOfExperienceAndResumeResponseDto> {
    const countOfExperience = await this.experienceRepository.countExperience(userId);

    const countOfResume = await this.resumeRepository.count({
      where: { userId },
    });

    const getCountOfExperienceAndResumeResponseDto = new GetCountOfExperienceAndResumeResponseDto(countOfExperience, countOfResume);

    return getCountOfExperienceAndResumeResponseDto;
  }
}
