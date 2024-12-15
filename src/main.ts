import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './ioC/app.module';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from './common/loggers/domain/logger.service';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(ConfigService).get('app');
  const logger = await app.resolve(LoggerService);
  logger.contextName = bootstrap.name;

  app.enableCors({ origin: env.origin });

  const configSwagger = new DocumentBuilder().setTitle('Template-Nest').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  await app.listen(env.port);
  logger.info(`Application is running on port ${env.port}`, true);
}
bootstrap();
