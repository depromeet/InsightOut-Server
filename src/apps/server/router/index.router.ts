import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { RouterModule } from '@nestjs/core';
import { VirtualRouter } from './virtual/virtual.router';
import { PrivateRouter } from './private/private.router';
import { PublicRouter } from './public/public.router';

@Module({
  imports: [
    PublicRouter,
    PrivateRouter,
    VirtualRouter,
    RouterModule.register([
      {
        path: 'public',
        module: PublicRouter,
      },
      {
        path: 'private',
        module: PrivateRouter,
      },
      {
        path: 'virtual',
        module: VirtualRouter,
      },
    ]),
  ],
  controllers: [IndexController],
})
export class IndexRouterModule {}
