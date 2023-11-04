export interface UserRepository {
  findById(userId: number);
  findFirst;
  update;
}

export const UserRepository = Symbol('UserRepository');
