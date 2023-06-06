import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiCapabilityRepositoryInterface } from '🔥apps/server/ai/interface/ai-repository.interface';

@Injectable()
export class AiCapabilityRepository implements AiCapabilityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
}
