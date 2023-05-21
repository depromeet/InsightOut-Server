import { Injectable } from '@nestjs/common';
import { CreateExperienceInfoReqDto } from './dto/req/createExperienceInfo.dto';
import { PrismaService } from '../../../modules/database/prisma.service';
import { UserJwtToken } from '../auth/types/jwt-tokwn.type';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}
  public async createExperienceInfo(
    body: CreateExperienceInfoReqDto,
    user: UserJwtToken,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const experience = await tx.experience.create({
        data: {
          title: body.title,
          startDate: body.startDate,
          endDate: body.endDate,
          experienceStatus: body.experienceStatus,
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
  }
}
