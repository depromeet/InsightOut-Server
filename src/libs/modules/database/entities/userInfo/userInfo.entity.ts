import { BaseTimeEntity } from '@libs/modules/database/entities/common/baseTimeEntity.entity';
import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';
import { Field, Provider, UserInfoEntity } from '@libs/modules/database/entities/userInfo/userInfoEntity.interface';

export class UserInfo extends BaseTimeEntity implements UserInfoEntity {
  userId: number;
  field?: Field;
  provider?: Provider;
  imageUrl?: string;

  // Relationship
  User: UserEntity;
}
