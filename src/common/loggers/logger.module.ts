import { Module } from '@nestjs/common';

import { LoggerService } from './domain/logger.service';
import { LoggersRepository } from './domain/repositories/logger.repository';
import { LoggersController } from './http/loggers.controler';

@Module({
  providers: [LoggerService, LoggersRepository],
  exports: [LoggerService],
  controllers: [LoggersController],
})
export class LoggerModule {}
