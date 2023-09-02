import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';

import { PrismaService } from '../prisma.service';

type UserInfoDelegate = Prisma.UserInfoDelegate<DefaultArgs>;

@Injectable()
export class UserInfoRepository extends AbstractRepository<
  UserInfoDelegate,
  DelegateArgs<UserInfoDelegate>,
  DelegateReturnTypes<UserInfoDelegate>
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.userInfo, prisma.readonlyInstance.userInfo);
  }

  insertUserInfo(data: Prisma.UserInfoCreateInput) {
    return this.prisma.userInfo.create({
      data,
    });
  }
}
