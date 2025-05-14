import { Controller, Get, Param } from '@nestjs/common';
import { LoggersRepository } from '../domain/repositories/logger.repository';

@Controller('loggers')
export class LoggersController {
  constructor(private readonly loggersRepository: LoggersRepository) {}

  @Get()
  findAll() {
    return this.loggersRepository.findAll();
  }

  @Get('user/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.loggersRepository.findAllByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loggersRepository.findOne(id);
  }
}
