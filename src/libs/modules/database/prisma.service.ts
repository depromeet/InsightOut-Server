import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(readonly envService: EnvService) {
    const url =
      envService.get<string>(EnvEnum.NODE_ENV) === 'test'
        ? envService.get<string>(EnvEnum.TEST_DATABASE_URL)
        : envService.get<string>(EnvEnum.DATABASE_URL);
    super({
      datasources: {
        db: {
          url,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
