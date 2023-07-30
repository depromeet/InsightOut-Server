import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { ExperienceCapability, Prisma } from '@prisma/client';
import { ExperienceCapabilityRepositoryInterface } from '🔥apps/server/experiences/interfaces/experienceRepository.interface';

@Injectable()
export class ExperienceCapabilityRepository implements ExperienceCapabilityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(createdInfos: { experienceId: number; capabilityId: number }[]): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.createMany({ data: createdInfos, skipDuplicates: true });
  }

  public async deleteByExperienceId(experienceId: number): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.deleteMany({ where: { experienceId } });
  }

  public async findManyByFilter(where: Prisma.ExperienceCapabilityWhereInput): Promise<ExperienceCapability[]> {
    return await this.prisma.experienceCapability.findMany({ where });
  }
}
