import { Module } from '@nestjs/common';
import { VirtualExceptionController } from './virtual-exception.controller';

@Module({
  imports: [],
  controllers: [VirtualExceptionController],
})
export class VirtualExceptionRouter {}
