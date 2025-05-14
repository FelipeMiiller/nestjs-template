import { Module } from '@nestjs/common';

import { LoggerService } from './domain/logger.service';
import { LoggersRepository } from './domain/repositories/logger.repository';
import { LoggersController } from './http/loggers.controler';
import mongoConfig from 'src/config/mongo.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger, LoggerSchema } from './domain/logger.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Logger.name, schema: LoggerSchema }])],
  providers: [LoggerService, LoggersRepository],
  exports: [LoggerService],
  controllers: [LoggersController],
})
export class LoggerModule {}
