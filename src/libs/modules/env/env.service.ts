import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvEnum } from './env.enum';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: EnvEnum, defaultValue?: T): T {
    return (this.configService.get(EnvEnum[key]) as T) || defaultValue;
  }
}
