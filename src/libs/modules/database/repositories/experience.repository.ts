import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { ExperienceSelect } from '🔥apps/server/experiences/interface/experience-select.interface';
import { ExperienceRepositoryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';

@Injectable()
export class ExperienceRepository implements ExperienceRepositoryInterface {
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

  public async selectOneByUserId(
    userId: number,
    select: ExperienceSelect,
  ): Promise<Partial<Experience & { experienceInfo: ExperienceInfo }>> {
    return await this.prisma.experience.findFirstOrThrow({
      select,
      where: { userId, experienceStatus: ExperienceStatus.INPROGRESS },
    });
  }

  public async findOneByUserId(userId: number): Promise<Experience> {
    return await this.prisma.experience.findFirst({
      include: { ExperienceInfo: true },
      where: { userId, experienceStatus: ExperienceStatus.INPROGRESS },
    });
  }

  public async countExperience(userId: number): Promise<number> {
    return await this.prisma.experience.count({
      where: { userId },
    });
  }
}
