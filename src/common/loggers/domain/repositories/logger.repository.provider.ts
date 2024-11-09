import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Provider } from '@nestjs/common';
import { LOGGERS_REPOSITORY_TOKEN } from './logger.repository.interface';
import { LoggersTypeOrmRepository } from './logger.repository';
import { LoggersModel } from '../models/logs.model';


export function provideTasksRepository(): Provider[] {
  return [
    {
      provide: LOGGERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: TasksRepoDependenciesProvider) =>
        new LoggersTypeOrmRepository(dependenciesProvider.typeOrmRepository),
      inject: [TasksRepoDependenciesProvider],
    },
    TasksRepoDependenciesProvider,
  ];
}

@Injectable()
export class TasksRepoDependenciesProvider {
  constructor(
    @InjectRepository(LoggersModel)
    public typeOrmRepository: Repository<LoggersModel>,
  ) {}
}
