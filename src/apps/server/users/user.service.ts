import { Injectable } from '@nestjs/common';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
