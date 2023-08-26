import { Injectable } from '@nestjs/common';
import { ExperienceCapability, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { ExperienceCapabilityRepositoryInterface } from '@apps/server/experiences/interfaces/experienceRepository.interface';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';

import { PrismaService } from '../prisma.service';

type ExperienceCapabilityDelegate = Prisma.ExperienceCapabilityDelegate<DefaultArgs>;

@Injectable()
export class ExperienceCapabilityRepository
  extends AbstractRepository<
    ExperienceCapabilityDelegate,
    DelegateArgs<ExperienceCapabilityDelegate>,
    DelegateReturnTypes<ExperienceCapabilityDelegate>
  >
  implements ExperienceCapabilityRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.experienceCapability, prisma.readonlyInstance.experienceCapability);
  }

  public async deleteByExperienceId(experienceId: number): Promise<Prisma.BatchPayload> {
    return await this.prisma.experienceCapability.deleteMany({ where: { experienceId } });
  }

  public async findManyByFilter(where: Prisma.ExperienceCapabilityWhereInput): Promise<ExperienceCapability[]> {
    return await this.prisma.experienceCapability.findMany({ where });
  }
}
