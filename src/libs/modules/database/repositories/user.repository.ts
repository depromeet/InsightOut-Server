import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { AbstractRepository, DelegateArgs, DelegateReturnTypes } from '📚libs/modules/database/repositories/abstract.repository';

type UserDelegate = Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

@Injectable()
export class UserRepository extends AbstractRepository<UserDelegate, DelegateArgs<UserDelegate>, DelegateReturnTypes<UserDelegate>> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  async insertUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }
}
