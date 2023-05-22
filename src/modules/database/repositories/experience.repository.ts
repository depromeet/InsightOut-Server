import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, Prisma } from '@prisma/client';
import { ExperienceSelect } from '../../../apps/server/experience/interface/experience-select.interface';
import { ExperienceReposirotyInterface } from '../../../apps/server/experience/interface/experience-repository.interface';

@Injectable()
export class ExperienceRepository implements ExperienceReposirotyInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
    return await this.prisma.experience.create({
      data,
    });
  }

  public async selectOneById(experienceId: number, select: ExperienceSelect): Promise<Experience> {
    return (await this.prisma.experience.findUniqueOrThrow({
      select,
      where: { id: experienceId },
    })) as Experience;
  }
}
