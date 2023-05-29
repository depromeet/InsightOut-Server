import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';
import { ExperienceRepositoryInterface } from './interface/experience-repository.interface';
import { CreateExperienceResDto } from './dto/res/createExperienceInfo.res.dto';
import { getExperienceAttribute } from '../common/consts/experience-attribute.const';
import { GetExperienceResDto } from './dto/res/getExperience.res.dto';
import { ExperienceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';
import { ExperienceRepository } from '📚libs/modules/database/repositories/experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(ExperienceRepository)
    private readonly experienceRepository: ExperienceRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  public async createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<CreateExperienceResDto> {
    try {
      const [experience, experienceInfo] = await this.prisma.$transaction(async (tx) => {
        const experience = await tx.experience.create({
          data: {
            title: body.title,
            startDate: body.startDate,
            endDate: body.endDate,
            experienceStatus: ExperienceStatus.INPROGRESS,
            userId: user.userId,
          },
        });

        const experienceInfo = await tx.experienceInfo.create({
          data: {
            experienceRole: body.experienceRole,
            motivation: body.motivation,
            experienceId: experience.id,
          },
        });
        return [experience, experienceInfo];
      });

      return new CreateExperienceResDto(experience, experienceInfo);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError)
        throw new UnprocessableEntityException('경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요');
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
      if (!experience) return '생성된 경험카드가 없습니다';

      return new GetExperienceResDto(experience);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw new NotFoundException('해당 ID의 경험카드는 존재하지 않습니다.');
    }
  }
}
