import { Module } from '@nestjs/common';

import { UserController } from '@apps/server/users/user.controller';
import { UserService } from '@apps/server/users/user.service';
import { FeedbackRepository } from '@libs/modules/database/repositories/feedback.repository';
import { UserRepository } from '@libs/modules/database/repositories/user.repository';
import { SlackModule } from '@libs/modules/slack/slack.module';

@Module({
  imports: [SlackModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, FeedbackRepository],
})
export class UserModule {}
