import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiResumeRepositoryInterface } from '🔥apps/server/ai/interface/ai-repository.interface';

@Injectable()
export class AiResumeRepository implements AiResumeRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
}
