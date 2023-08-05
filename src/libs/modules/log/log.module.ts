import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';

import { LogService } from './log.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          ...(() => {
            return [
              //Console
              ...(() => {
                const consoles: winston.transports.ConsoleTransportInstance[] = [];

                consoles.push(
                  new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                      winston.format.timestamp(),
                      winston.format.ms(),
                      utilities.format.nestLike('SERVER', {
                        prettyPrint: true,
                        colors: true,
                      }),
                    ),
                  }),
                );

                return consoles;
              })(),
            ];
          })(),
        ],
      }),
    }),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: LogModule,
    };
  }
}
