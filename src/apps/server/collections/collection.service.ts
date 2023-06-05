import { Injectable, NotFoundException } from '@nestjs/common';
import { CapabilityRepository } from '📚libs/modules/database/repositories/capability.repository';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { GetCountOfExperienceAndCapabilityResponseDto } from '🔥apps/server/collections/dtos/get-count-of-experience-and-capability.dto';
import { GetCountOfExperienceAndResumeResponseDto } from '🔥apps/server/collections/dtos/get-count-of-experience-and-resume.dto';
import { CountExperienceAndCapability } from '🔥apps/server/collections/types/count-experience-and-capability.type';

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

  public async getCountOfExperienceAndCapability(userId: number): Promise<GetCountOfExperienceAndCapabilityResponseDto[]> {
    const countOfExperienceAndCapability = await this.capabilityRepository.countExperienceAndCapability(userId);

    // count가 0인 키워드는 필터링합니다.
    const filteredCountOfExperienceAndCapability = countOfExperienceAndCapability.filter((row: CountExperienceAndCapability) => {
      row._count.ExperienceCapability !== 0;
    });

    if (!filteredCountOfExperienceAndCapability.length) {
      console.log(filteredCountOfExperienceAndCapability);
      throw new NotFoundException('Experience not found');
    }

    const countOfExperienceAndCapabilityResponseDto = filteredCountOfExperienceAndCapability.map(
      (count) => new GetCountOfExperienceAndCapabilityResponseDto(count as CountExperienceAndCapability),
    );
    return countOfExperienceAndCapabilityResponseDto;
  }
}
