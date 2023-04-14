import { Module } from '@nestjs/common';
import { PrivateController } from './private.controller';

@Module({
  imports: [],
  controllers: [PrivateController],
})
export class PrivateRouter {}
