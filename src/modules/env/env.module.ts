import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodeEnvEnum } from 'src/enums/node-env.enum';
import { EnvService } from 'src/modules/env/env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const envFiles: string[] = [];
        switch (process.env.NODE_ENV) {
          case NodeEnvEnum.Main:
            envFiles.unshift(`.env.${NodeEnvEnum.Main}`);
          case NodeEnvEnum.Stage:
            envFiles.unshift(`.env.${NodeEnvEnum.Stage}`);
          case NodeEnvEnum.Test:
            envFiles.unshift(`.env.${NodeEnvEnum.Test}`);
          default:
            envFiles.unshift(`.env.${NodeEnvEnum.Dev}`);
        }
        return envFiles;
      })(),
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
