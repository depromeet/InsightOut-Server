import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NodeEnvEnum } from 'src/enums/node-env.enum';
import { EnvEnum } from 'src/modules/env/env.enum';
import { EnvService } from 'src/modules/env/env.service';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  //환경변수 가져오기
  const envService = app.get(EnvService);
  const NODE_ENV = envService.get<NodeEnvEnum>(EnvEnum.NODE_ENV);
  const PORT = +envService.get(EnvEnum.PORT) || 3000;

  //Swagger
  switch (NODE_ENV) {
    case NodeEnvEnum.Dev:
      (() => {
        const config = new DocumentBuilder()
          .setTitle('13기 4팀 서버')
          .setDescription('자기소개서 관리 시스템')
          .addServer(
            `http://localhost:${envService.get(EnvEnum.PORT)}`,
            '로컬서버',
          )
          .addServer(
            `${envService.get(EnvEnum.DEV_SERVER)}:${envService.get(
              EnvEnum.PORT,
            )}`,
            '개발서버',
          )
          .addServer(
            `${envService.get(EnvEnum.STAGE_SERVER)}:${envService.get(
              EnvEnum.PORT,
            )}`,
            '스테이트서버',
          )
          .addServer(
            `${envService.get(EnvEnum.MAIN_SERVER)}:${envService.get(
              EnvEnum.PORT,
            )}`,
            '운영서버',
          )

          .addBearerAuth()
          .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
      })();
      break;
    case NodeEnvEnum.Test:
    case NodeEnvEnum.Main:
      break;
  }

  //Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'X-Request-With',
      'Content-Type',
      'Accept',
    ],
    credentials: true,
  });
  //서버 시작
  await app.listen(PORT);
}
bootstrap();
