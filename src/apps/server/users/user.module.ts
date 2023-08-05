import { Module } from '@nestjs/common';

import { UserController } from '@apps/server/users/user.controller';
import { UserService } from '@apps/server/users/user.service';
import { FeedbackRepository } from '@libs/modules/database/repositories/feedback.repository';
import { UserRepository } from '@libs/modules/database/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, FeedbackRepository],
})
export class UserModule {}
