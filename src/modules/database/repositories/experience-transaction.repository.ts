import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperienceInfoReqDto } from '../../../apps/server/experience/dto/req/createExperienceInfo.dto';
import { UserJwtToken } from '../../../apps/server/auth/types/jwt-tokwn.type';
import { Experience, ExperienceInfo, ExperienceStatus } from '@prisma/client';
import { ExperienceTransactionInterface } from '../../../apps/server/experience/interface/experience-repository.interface';

@Injectable()
export class ExperienceTransactionRepository implements ExperienceTransactionInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async createExperienceInfo(body: CreateExperienceInfoReqDto, user: UserJwtToken): Promise<[Experience, ExperienceInfo]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const experience = await tx.experience.create({
          data: {
            title: body.title,
            startDate: body.startDate,
            endDate: body.endDate,
            experienceStatus: ExperienceStatus.inprogress,
            userId: user.userId,
          },
        });

        const experienceInfo = await tx.experienceInfo.create({
          data: {
            experienceRole: body.experienceRole,
            motivate: body.motivate,
            experienceId: experience.id,
          },
        });
        return [experience, experienceInfo];
      });
    } catch (error) {
      throw new UnprocessableEntityException('경험 카드 생성하는 데 실패했습니다. 타입을 확인해주세요');
    }
  }
}
