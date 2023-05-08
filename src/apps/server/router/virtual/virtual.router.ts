import { Module } from '@nestjs/common';
import { VirtualExceptionRouter } from './exception/virtual-exception.router';
import { VirtualController } from './virtual.controller';

@Module({
  imports: [VirtualExceptionRouter],
  controllers: [VirtualController],
})
export class VirtualRouter {}
