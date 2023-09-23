import { Injectable } from '@nestjs/common';
import { ExperienceInfo, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ExperienceInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.ExperienceInfoCreateInput): Promise<ExperienceInfo> {
    return await this.prisma.experienceInfo.create({
      data,
    });
  }
}
