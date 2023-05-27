import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExperienceInfo, Prisma } from '@prisma/client';

@Injectable()
export class ExperienceInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: Prisma.ExperienceInfoCreateInput,
  ): Promise<ExperienceInfo> {
    return await this.prisma.experienceInfo.create({
      data,
    });
  }
}
