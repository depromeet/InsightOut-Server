import { Injectable } from '@nestjs/common';
import { ExperienceCapability, Prisma } from '@prisma/client';

import { ExperienceCapabilityRepository } from '@libs/modules/database/repositories/experienceCapability/experienceCapability.interface';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class ExperienceCapabilityRepositoryImpl implements ExperienceCapabilityRepository {
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
