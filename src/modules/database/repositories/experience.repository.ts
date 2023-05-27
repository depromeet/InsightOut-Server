import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, Prisma } from '@prisma/client';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
    return await this.prisma.experience.create({
      data,
    });
  }
}
