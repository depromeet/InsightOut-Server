import { Module } from '@nestjs/common';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { UserService } from '🔥apps/server/users/user.service';

@Module({
  controllers: [],
  providers: [UserService, UserRepository],
})
export class UserModule {}
