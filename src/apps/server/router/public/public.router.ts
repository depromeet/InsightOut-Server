import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';

@Module({
  imports: [],
  controllers: [PublicController],
})
export class PublicRouter {}
