import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  insertUserInfo(data: Prisma.UserInfoCreateInput) {
    return this.prisma.userInfo.create({
      data,
    });
  }
}
