import { Inject } from '@nestjs/common';

import { ILike, Repository } from 'typeorm';
import { LOGGERS_REPOSITORY_TOKEN, LoggersRepository } from './logger.repository.interface';
import { LoggersModel } from '../models/logs.model';
import { LoggerEntity } from '../entities/logger.entity';


export class LoggersTypeOrmRepository implements LoggersRepository {
  constructor(
    @Inject(LOGGERS_REPOSITORY_TOKEN)
    private readonly loggersRepository: Repository<LoggersModel>,
  ) {}

  async create(logger: LoggerEntity): Promise<LoggersModel> {
    const tasksCreated = this.loggersRepository.create(logger);

    return this.loggersRepository.save(tasksCreated);
  }

  async update(id: string, logger: Partial<LoggerEntity>): Promise<LoggersModel> {
    const filteredTask: Partial<LoggerEntity> = Object.keys(logger).reduce((acc, key) => {
      if (Boolean(logger[key])) {
        acc[key] = logger[key];
      }
      return acc;
    }, {});

    const updateTask = await this.loggersRepository.preload({
      id,
      ...filteredTask,
    });

    if (!updateTask) {
      return null;
    }

    return await this.loggersRepository.save(updateTask);
  }

  async findById(id: string): Promise<LoggersModel> {
    return this.loggersRepository.findOne({
      where: { id: id },
    });
  }

  async findMany(pagination?: Partial<{ page: number; limit: number }>, level?: string): Promise<LoggersModel[]> {
    const { page = 1, limit = 10 } = pagination || {};

    const skip = (page - 1) * limit;
    if (level) {
      return this.loggersRepository.find({
        where: { level: ILike(`%${level}%`) },
        skip,
        take: limit,
      });
    }
    return this.loggersRepository.find({
      skip,
      take: limit,
    });
  }

  async delete(id: string): Promise<void> {
    await this.loggersRepository.delete({ id });
  }

  async deleteAll(): Promise<void> {
    await this.loggersRepository.delete({});
  }
}
