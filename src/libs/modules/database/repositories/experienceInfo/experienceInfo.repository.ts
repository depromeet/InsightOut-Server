import { Injectable } from '@nestjs/common';
import { ExperienceInfo, Prisma } from '@prisma/client';

import { ExperienceInfoRepository } from '@libs/modules/database/repositories/experienceInfo/experienceInfo.interface';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class ExperienceInfoRepositoryImpl implements ExperienceInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.ExperienceInfoCreateInput): Promise<ExperienceInfo> {
    return await this.prisma.experienceInfo.create({
      data,
    });
  }
}
