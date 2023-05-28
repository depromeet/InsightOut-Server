import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst(whereInput: Prisma.UserWhereInput): Promise<User> {
    return await this.prisma.user.findFirst({
      where: whereInput,
    });
  }

  async insertUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }
}
