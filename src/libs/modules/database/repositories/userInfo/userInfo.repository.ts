import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserInfoRepository } from '@libs/modules/database/repositories/userInfo/userInfo.interface';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserInfoRepositoryImpl implements UserInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  insertUserInfo(data: Prisma.UserInfoCreateInput) {
    return this.prisma.userInfo.create({
      data,
    });
  }
}
