import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';

import { PrismaService } from '../prisma.service';

type UserDelegate = Prisma.UserDelegate<DefaultArgs>;

@Injectable()
export class UserRepository extends AbstractRepository<UserDelegate, DelegateArgs<UserDelegate>, DelegateReturnTypes<UserDelegate>> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  getOneUser(userId: number) {
    return this.findFirst({
      where: { id: userId },
      select: { nickname: true, email: true, UserInfo: { select: { imageUrl: true, field: true } } },
    });
  }

  async insertUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }
}
