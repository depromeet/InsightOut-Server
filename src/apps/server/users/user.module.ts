import { Module } from '@nestjs/common';

import { UserController } from '@apps/server/users/user.controller';
import { UserService } from '@apps/server/users/user.service';
import { FeedbackRepository } from '@libs/modules/database/repositories/feedback/feedback.interface';
import { FeedbackRepositoryImpl } from '@libs/modules/database/repositories/feedback/feedback.repository';
import { UserRepository } from '@libs/modules/database/repositories/user/user.interface';
import { UserRepositoryImpl } from '@libs/modules/database/repositories/user/user.repository';
import { SlackModule } from '@libs/modules/slack/slack.module';

@Module({
  imports: [SlackModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: FeedbackRepository,
      useClass: FeedbackRepositoryImpl,
    },
  ],
})
export class UserModule {}
