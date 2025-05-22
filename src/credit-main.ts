import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CreditModule } from './modules/credit-engine/credit-engine.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(CreditModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3006);
}

bootstrap();
