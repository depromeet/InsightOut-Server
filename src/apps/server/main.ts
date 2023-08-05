import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { swaggerDescriptionMd } from '@apps/server/common/docs/swaggerDescription.markdown';
import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  //환경변수 가져오기
  const envService = app.get(EnvService);
  const PORT = +envService.get(EnvEnum.PORT) || 3000;

  const config = new DocumentBuilder()
    .setTitle('13기 4팀 서버')
    .setDescription(swaggerDescriptionMd)
    .addServer(`${envService.get(EnvEnum.MAIN_SERVER)}/api`, 'Main서버')
    .addServer(`${envService.get(EnvEnum.DEV_SERVER)}/api`, '개발서버')
    .addServer(`http://localhost:${envService.get(EnvEnum.PORT)}/api`, '로컬서버')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurityRequirements('bearer')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'InsightOut API',
    customCss: `
    .swagger-ui .parameter__extension, .swagger-ui .parameter__in {
      color: magenta;
      font-family: monospace;
      font-size: 12px;
      font-style: italic;
      font-weight: 600;
  }`,
  });

  //Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('/api', { exclude: ['/'] });

  app.enableCors();

  //서버 시작
  await app.listen(PORT);
}
bootstrap();
