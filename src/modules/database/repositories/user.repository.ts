import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFirstByUserId(userId: number) {
    return await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });
  }
}
