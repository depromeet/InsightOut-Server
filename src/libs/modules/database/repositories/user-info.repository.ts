import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  insertUserInfo(data: Prisma.UserInfoCreateInput) {
    return this.prisma.userInfo.create({
      data,
    });
  }
}
