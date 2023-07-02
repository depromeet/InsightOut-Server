import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { ExperienceSelect } from '🔥apps/server/experiences/interface/experience-select.interface';
import { ExperienceRepositoryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';
import { ExperienceCardType } from '🔥apps/server/experiences/types/experience-card.type';
import { PaginationOptionsDto } from '📚libs/pagination/pagination-option.dto';

@Injectable()
export class ExperienceRepository implements ExperienceRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async getExperienceById(experienceId: number): Promise<Partial<Experience & { ExperienceInfo; AiResume }>> {
    return await this.prisma.experience.findUnique({
      where: { id: experienceId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        situation: true,
        task: true,
        action: true,
        result: true,
        experienceStatus: true,
        summaryKeywords: true,
        updatedAt: true,
        ExperienceInfo: { select: { experienceId: true, experienceRole: true, motivation: true, utilization: true } },
        AiResume: {
          select: { content: true, AiResumeCapability: { select: { Capability: { select: { keyword: true, keywordType: true } } } } },
        },
      },
    });
  }
  public async getExperienceCardInfo(experienceId: number): Promise<ExperienceCardType> {
    return await this.prisma.experience.findUnique({
      where: { id: experienceId },
      select: {
        summaryKeywords: true,
        title: true,
        situation: true,
        task: true,
        action: true,
        result: true,
        ExperienceInfo: { select: { analysis: true } },
        ExperienceCapability: { select: { Capability: { select: { keyword: true, keywordType: true } } } },
        AiResume: {
          select: { content: true, AiResumeCapability: { select: { Capability: { select: { keyword: true, keywordType: true } } } } },
        },
        AiRecommendQuestion: { select: { id: true, title: true } },
      },
    });
  }

  public async findOneById(experienceId: number): Promise<Experience & { AiResume; ExperienceInfo; AiRecommendQuestion }> {
    return await this.prisma.experience.findUnique({
      where: { id: experienceId },
      include: { ExperienceInfo: true, AiResume: true, AiRecommendQuestion: true },
    });
  }

  public async getCount(userId: number) {
    return await this.prisma.experience.count({ where: { userId } });
  }

  public async selectOneById(
    experienceId: number,
    select: ExperienceSelect,
  ): Promise<Partial<Experience & { experienceInfo: ExperienceInfo }>> {
    return await this.prisma.experience.findUniqueOrThrow({
      select,
      where: { id: experienceId },
    });
  }

  public async selectOneByUserId(
    userId: number,
    select: ExperienceSelect,
  ): Promise<Partial<Experience & { experienceInfo: ExperienceInfo }>> {
    return await this.prisma.experience.findFirstOrThrow({
      select,
      where: { userId, experienceStatus: ExperienceStatus.INPROGRESS },
    });
  }

  public async findManyByUserId(userId: number, select: ExperienceSelect, pagination: PaginationOptionsDto) {
    const { criteria, order, take, skip } = pagination;
    return await this.prisma.experience.findMany({
      select,
      where: { userId },
      orderBy: { [criteria]: order },
      take,
      skip,
    });
  }

  public async findOneByUserId(userId: number): Promise<Experience> {
    return await this.prisma.experience.findFirst({
      include: { ExperienceInfo: true },
      where: { userId, experienceStatus: ExperienceStatus.INPROGRESS },
    });
  }

  public async countExperience(userId: number): Promise<number> {
    return await this.prisma.experience.count({
      where: { userId },
    });
  }

  public async getExperienceByCapability(
    userId: number,
    capabilityId: number,
    select: Partial<ExperienceSelect>,
    pagination: PaginationOptionsDto,
  ) {
    const { criteria, order, take, skip } = pagination;
    // TODO ai 역량 키워드가 적용되면 해당 키워드도 함께 쿼리로 가져와야 함.
    const experiences = await this.prisma.experience.findMany({
      where: { userId, ExperienceCapability: { some: { capabilityId: { equals: capabilityId } } } },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        experienceStatus: true,
        ...select,
      },
      orderBy: { [criteria]: order },
      take,
      skip,
    });

    const experienceWithCapability = await Promise.all(
      experiences.map(async (experience) => {
        const capability = await this.prisma.capability.findMany({
          where: { ExperienceCapability: { some: { experienceId: experience.id } } },
          select: { id: true, keyword: true, keywordType: true },
        });

        return Object.assign(experience, { capability });
      }),
    );

    return experienceWithCapability;
  }

  public async getStarFromExperienceByExperienceId(experienceId: number) {
    return await this.prisma.experience.findFirst({
      where: {
        id: experienceId,
        experienceStatus: ExperienceStatus.DONE,
      },
      select: { id: true, title: true, situation: true, task: true, action: true, result: true },
    });
  }
}
