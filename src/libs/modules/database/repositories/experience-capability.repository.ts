import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExperienceCapabilityRepositiryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceCapabilityRepository implements ExperienceCapabilityRepositiryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async createMany(createdInfos: { experienceId: number; capabilityId: number }[]): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.createMany({ data: createdInfos, skipDuplicates: true });
  }
}
