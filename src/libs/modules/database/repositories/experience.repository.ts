import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiRecommendQuestion, AiResume, Experience, ExperienceInfo, ExperienceStatus, Prisma } from '@prisma/client';
import { ExperienceSelect } from '🔥apps/server/experiences/interface/experience-select.interface';
import { ExperienceRepositoryInterface } from '🔥apps/server/experiences/interface/experience-repository.interface';
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
        ExperienceInfo: { select: { experienceId: true, experienceRole: true, motivation: true, analysis: true } },
        ExperienceCapabilities: { select: { Capability: { select: { id: true, keyword: true } } } },
        AiResume: {
          select: { content: true, AiResumeCapabilities: { select: { Capability: { select: { keyword: true } } } } },
        },
        AiRecommendQuestions: true,
      },
    });
  }
  public async getExperienceCardInfo(experienceId: number) {
    return await this.prisma.experience.findUnique({
      where: { id: experienceId },
      select: {
        startDate: true,
        endDate: true,
        summaryKeywords: true,
        title: true,
        situation: true,
        task: true,
        action: true,
        result: true,
        ExperienceInfo: { select: { analysis: true } },
        ExperienceCapabilities: { select: { Capability: { select: { keyword: true } } } },
        AiResume: {
          select: { content: true, AiResumeCapabilities: { select: { Capability: { select: { keyword: true } } } } },
        },
        AiRecommendQuestions: { select: { id: true, title: true } },
      },
    });
  }

  public async findOneById(
    experienceId: number,
    userId: number,
  ): Promise<Experience & { AiResume: AiResume; ExperienceInfo: ExperienceInfo; AiRecommendQuestions: AiRecommendQuestion[] }> {
    return await this.prisma.experience.findFirst({
      where: { id: experienceId, userId },
      include: { ExperienceInfo: true, AiResume: true, AiRecommendQuestions: true },
    });
  }

  public async getCount(userId: number) {
    return await this.prisma.experience.count({ where: { userId } });
  }

  public async getCountByIsCompleted(userId: number, isCompleted: boolean) {
    const where = <Prisma.ExperienceWhereInput>{ userId };
    if (isCompleted) {
      where.experienceStatus = ExperienceStatus.DONE;
    }
    return await this.prisma.experience.count({ where });
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

  /**
   * # 경험 카드 모두 조회
   *
   * ## 1. 설명
   *
   * 유저가 작성한 경험 카드를 모두 조회합니다. 페이지네이션, 일부 조회, capabilityId를 통한 필터링이 가능합니다.
   *
   * ## 2. 사용 방법
   *
   * - select는 쿼리에서 조회할 값들을 의미합니다. 이를 제외하고 기본적으로 반환해야 하는 값들은 id, title, startDate, endDate, experienceStatus, summaryKeywords, ExperienceCapability, AiResume 입니다.
   * ...select 스프레드 연산자로, 조회할 컬럼을 입력해 주세요.
   * - pagination은 페이지네이션에 필요한 인자들입니다.
   *   - criteria는 정렬 기준을 의미합니다. 기본값은 id입니다.
   *   - order는 정렬 순서를 의미합니다. 기본값은 'desc', 내림차순입니다.
   *   - take는 한 페이지에 보여줄 데이터의 개수를 의미합니다. 기본값은 3입니다.
   *   - skip은 건너뛸 row의 개수입니다. (page - 1) * take로 구합니다.
   *
   * ## 3. 응답값
   *
   * @param userId 유저 고유 아이디
   * @param select 추가적으로 조회할 컬럼들
   * @param pagination 페이지네이션 옵션
   * @param capabilityId 역량 키워드 ID
   * @returns 조건에 맞는 경험카드
   */
  public async getExperiences(userId: number, select: Partial<ExperienceSelect>, pagination: PaginationOptionsDto, capabilityId?: number) {
    const { criteria, order, take, skip } = pagination;
    let experiences = await this.prisma.experience.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        experienceStatus: true,
        summaryKeywords: true,
        ExperienceCapabilities: { select: { Capability: true } },
        AiResume: { select: { AiResumeCapabilities: { select: { Capability: true } } } },
        AiRecommendQuestions: true,
        ExperienceInfo: { select: { analysis: true } },
        ...select,
      },
      orderBy: { [criteria]: order },
      take,
      skip,
    });

    if (capabilityId) {
      experiences = experiences.filter((experience) =>
        experience.ExperienceCapabilities.find((experienceCapability) => experienceCapability.Capability.id === capabilityId),
      );
    }

    experiences = experiences.filter((experience) => {
      if (experience.experienceStatus === ExperienceStatus.DONE) {
        return (
          experience.title &&
          experience.situation &&
          experience.task &&
          experience.action &&
          experience.result &&
          experience.startDate instanceof Date &&
          experience.endDate instanceof Date &&
          experience.ExperienceInfo.analysis &&
          experience.AiResume &&
          experience.ExperienceCapabilities.length &&
          experience.AiRecommendQuestions.length &&
          experience.summaryKeywords.length
        );
      }
      return true;
    });

    return experiences;
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

  public async deleteOneById(id: number) {
    return await this.prisma.experience.delete({ where: { id } });
  }
}
