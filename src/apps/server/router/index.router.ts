import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { PrivateRouter } from './private/private.router';
import { PublicRouter } from './public/public.router';
import { VirtualRouter } from './virtual/virtual.router';

@Module({
  imports: [PublicRouter, PrivateRouter, VirtualRouter],
  controllers: [IndexController],
})
export class IndexRouterModule {}
