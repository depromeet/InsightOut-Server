import { Module } from '@nestjs/common';
import { VirtualController } from './virtual.controller';

@Module({
  imports: [],
  controllers: [VirtualController],
})
export class VirtualRouter {}
