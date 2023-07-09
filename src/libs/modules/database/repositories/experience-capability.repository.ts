import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExperienceCapabilityRepositoryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceCapabilityRepository implements ExperienceCapabilityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(createdInfos: { experienceId: number; capabilityId: number }[]): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.createMany({ data: createdInfos, skipDuplicates: true });
  }

  public async deleteByExperienceId(experienceId: number): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.deleteMany({ where: { experienceId } });
  }

  public async findManyByFilter(where: Prisma.ExperienceCapabilityWhereInput): Promise<{ Capability: { keyword: string } }[]> {
    return await this.prisma.experienceCapability.findMany({ where, select: { Capability: { select: { keyword: true } } } });
  }
}
