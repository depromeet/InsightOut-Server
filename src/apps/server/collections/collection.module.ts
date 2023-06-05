import { Module } from '@nestjs/common';
import { CollectionsController } from '🔥apps/server/collections/collection.controller';
import { CollectionProviders } from '🔥apps/server/collections/collection.provider';
import { CollectionsService } from '🔥apps/server/collections/collection.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, ...CollectionProviders],
})
export class CollectionsModule {}
