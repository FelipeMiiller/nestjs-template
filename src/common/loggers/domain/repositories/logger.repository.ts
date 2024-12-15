import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ILoggersRepository } from './logger.repository.interface';
import { CreateLoggerDto } from '../../dto/create-logger.dto';

@Injectable()
export class LoggersRepository implements ILoggersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLoggerDto: CreateLoggerDto) {
    return this.prisma.logger.create({
      data: createLoggerDto,
    });
  }

  async findAll() {
    return this.prisma.logger.findMany();
  }
  async findAllByLevel(level: string) {
    return this.prisma.logger.findMany({
      where: { level: level },
    });
  }
  async findAllByUserId(id: string) {
    return this.prisma.logger.findMany({
      where: { UserId: id, level: 'info' },
    });
  }

  async findAllByUserIdAndLevel(id: string, level: string) {
    return this.prisma.logger.findMany({
      where: { UserId: id, level: level },
    });
  }

  async findOne(id: number) {
    return this.prisma.logger.findUnique({
      where: { Id: id },
    });
  }
}
