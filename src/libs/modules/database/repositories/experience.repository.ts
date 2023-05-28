import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, ExperienceInfo } from '@prisma/client';
import { ExperienceReposirotyInterface } from '🔥apps/server/experience/interface/experience-repository.interface';
import { ExperienceSelect } from '🔥apps/server/experience/interface/experience-select.interface';

@Injectable()
export class ExperienceRepository implements ExperienceReposirotyInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async selectOneById(
    experienceId: number,
    select: ExperienceSelect,
  ): Promise<Partial<Experience & { experienceInfo: ExperienceInfo }>> {
    console.log('experienceId', experienceId);
    try {
      return await this.prisma.experience.findUniqueOrThrow({
        select,
        where: { id: experienceId },
      });
    } catch (error) {
      throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }
}
