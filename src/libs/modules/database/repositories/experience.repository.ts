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

  public async findManyByUserId(userId: number, select: ExperienceSelect) {
    return await this.prisma.experience.findMany({
      select,
      orderBy: { createdAt: 'desc' },
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

  public async getExperienceByCapability(capabilityId: number) {
    // TODO ai 역량 키워드가 적용되면 해당 키워드도 함께 쿼리로 가져와야 함.
    const experiences = await this.prisma.experience.findMany({
      where: { ExperienceCapability: { some: { capabilityId: { equals: capabilityId } } } },
      include: {
        ExperienceCapability: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const experienceWithCapability = await Promise.all(
      experiences.map(async (experience) => {
        const capability = await this.prisma.capability.findMany({
          where: { ExperienceCapability: { some: { experienceId: experience.id } } },
          select: { id: true, keyword: true },
        });

        const { ExperienceCapability, ...rest } = experience;

        return Object.assign(rest, { capability });
      }),
    );

    return experienceWithCapability;
  }
}
