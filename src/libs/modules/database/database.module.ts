import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
    };
  }
}
