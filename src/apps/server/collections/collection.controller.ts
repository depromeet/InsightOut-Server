import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionsService } from '🔥apps/server/collections/collection.service';
import { JwtAuthGuard } from '🔥apps/server/common/guards/jwt-auth.guard';

@ApiTags('🔍 모아보기 관련 API')
@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}
}
