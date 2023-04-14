import { Module } from '@nestjs/common';
import { IndexRouterModule } from './router/index.router';
import { DatabaseModule } from 'src/modules/database/database.module';
import { EnvModule } from 'src/modules/env/env.module';
import { LogModule } from 'src/modules/log/log.module';

@Module({
  imports: [DatabaseModule, EnvModule, LogModule, IndexRouterModule],
})
export class AppModule {}
