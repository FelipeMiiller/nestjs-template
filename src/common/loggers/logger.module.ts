import { Module } from '@nestjs/common';

import { LoggerService } from './domain/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
