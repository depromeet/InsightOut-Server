import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '@libs/modules/database/repositories/abstract.repository';
import { UserRepository } from '@libs/modules/database/repositories/user/user.interface';

import { PrismaService } from '../../prisma.service';

type UserDelegate = Prisma.UserDelegate<DefaultArgs>;

@Injectable()
export class UserRepositoryImpl
  extends AbstractRepository<UserDelegate, DelegateArgs<UserDelegate>, DelegateReturnTypes<UserDelegate>>
  implements UserRepository
{
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  findById(userId: number) {
    return this.findFirst({
      where: { id: userId },
      select: { nickname: true, email: true, UserInfo: { select: { imageUrl: true, field: true } } },
    });
  }
}
