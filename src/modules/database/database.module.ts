import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

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
