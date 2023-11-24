import { Capability } from '@libs/modules/database/entities/capability/capability.entity';
import { KeywordType } from '@libs/modules/database/entities/capability/capabilityEntity.interface';

export interface CapabilityRepository {
  save(capability: Capability): Promise<Partial<Capability>>;
  findOneByUserIdAndKeyword(userId: number, keyword: string, keywordType?: KeywordType): Promise<Partial<Capability>>;
  countExperienceAndCapability(userId: number, isCompleted?: boolean);
  findByUserId(userId: number): Promise<Partial<Capability>[]>;
}

export const CapabilityRepository = Symbol('CapabilityRepository');
