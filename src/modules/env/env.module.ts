import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from 'src/modules/env/env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.test', '.env.release', 'env.production'],
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: EnvModule,
    };
  }
}
