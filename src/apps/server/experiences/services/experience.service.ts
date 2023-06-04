import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UpsertExperienceReqDto } from '../dto/req/upsertExperience.dto';
import { UserJwtToken } from '../../auth/types/jwt-tokwn.type';
import { ExperienceRepositoryInterface } from '../interface/experience-repository.interface';
import { UpsertExperienceResDto } from '../dto/res/upsertExperienceInfo.res.dto';
import { getExperienceAttribute } from '../../common/consts/experience-attribute.const';
import { GetExperienceResDto } from '../dto/res/getExperience.res.dto';
import { Experience, ExperienceInfo, ExperienceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(ExperienceRepository)
    private readonly experienceRepository: ExperienceRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  public async upsertExperience(body: UpsertExperienceReqDto, user: UserJwtToken): Promise<UpsertExperienceResDto> {
    // 생성 중인 경험 카드가 있는지 확인
    const experinece = await this.experienceRepository.findOneByUserId(user.userId);
    if (experinece) {
      // 있으면 업데이트
      const updatedExperienceInfo = body.compareProperty(experinece);

      return await this.processUpdateExperience(experinece.id, updatedExperienceInfo);
    } else {
      // 없으면 생성
      try {
        return await this.processCreateExperience(body, user);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError)
          throw new UnprocessableEntityException('경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요');
      }
    }
  }

  public async getExperience(experienceId: number): Promise<Partial<GetExperienceResDto>> {
    try {
      const experience = await this.experienceRepository.selectOneById(experienceId, getExperienceAttribute);

      return new GetExperienceResDto(experience);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }

  public async getExperienceByUserId(userId: number): Promise<GetExperienceResDto | string> {
    try {
      const experience = await this.experienceRepository.selectOneByUserId(userId, getExperienceAttribute);
      if (!experience) return 'INPROGRESS 상태의 경험카드가 없습니다';

      return new GetExperienceResDto(experience);
    } catch (error) {
      console.log('error', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('INPROGRESS 상태의 경험카드가 없습니다.');
    }
  }

  // Private
  private async processCreateExperience(body: UpsertExperienceReqDto, user: UserJwtToken): Promise<UpsertExperienceResDto> {
    const [experience, experienceInfo] = await this.prisma.$transaction(async (tx) => {
      const experience = await tx.experience.create({
        data: {
          title: body.title,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          experienceStatus: ExperienceStatus.INPROGRESS,
          situation: body.situation,
          task: body.task,
          action: body.action,
          result: body.result,
          userId: user.userId,
        },
      });

      const experienceInfo = await tx.experienceInfo.create({
        data: {
          experienceRole: body.experienceRole,
          motivation: body.motivation,
          utilization: body.utilization,
          analysis: body.analysis,
          experienceId: experience.id,
        },
      });
      return [experience, experienceInfo];
    });

    return new UpsertExperienceResDto(experience, experienceInfo);
  }

  private async processUpdateExperience(
    id: number,
    updatedExperienceInfo: Experience & {
      ExperienceInfo?: ExperienceInfo;
    },
  ): Promise<UpsertExperienceResDto> {
    const [experience, experienceInfo] = await this.prisma.$transaction(async (tx) => {
      const experienceInfo = await tx.experienceInfo.update({
        where: { experienceId: id },
        data: {
          experienceRole: updatedExperienceInfo.ExperienceInfo.experienceRole,
          motivation: updatedExperienceInfo.ExperienceInfo.motivation,
          utilization: updatedExperienceInfo.ExperienceInfo.utilization,
          analysis: updatedExperienceInfo.ExperienceInfo.analysis,
        },
      });

      const experience = await tx.experience.update({
        where: { id },
        data: {
          experienceStatus: updatedExperienceInfo.experienceStatus,
          title: updatedExperienceInfo.title,
          startDate: updatedExperienceInfo.startDate,
          endDate: updatedExperienceInfo.endDate,
          situation: updatedExperienceInfo.situation,
          task: updatedExperienceInfo.task,
          action: updatedExperienceInfo.action,
          result: updatedExperienceInfo.result,
        },
      });
      return [experience, experienceInfo];
    });
    return new UpsertExperienceResDto(experience, experienceInfo);
  }
}
