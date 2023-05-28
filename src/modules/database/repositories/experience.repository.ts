import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, ExperienceInfo } from '@prisma/client';
import { ExperienceSelect } from '../../../apps/server/experiences/interface/experience-select.interface';
import { ExperienceReposirotyInterface } from '../../../apps/server/experiences/interface/experience-repository.interface';

@Injectable()
export class ExperienceRepository implements ExperienceReposirotyInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async selectOneById(
    experienceId: number,
    select: ExperienceSelect,
  ): Promise<Partial<Experience & { experienceInfo: ExperienceInfo }>> {
    return await this.prisma.experience.findUniqueOrThrow({
      select,
      where: { id: experienceId },
    });
  }
}
