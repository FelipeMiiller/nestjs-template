import { LoggerEntity } from '../entities/logger.entity';
import { LoggersModel } from '../models/logs.model';

export interface LoggersRepository {
  create(logger: LoggerEntity): Promise<LoggersModel>;
  update(id: string, logger: Partial<LoggerEntity>): Promise<LoggersModel>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  findById(id: string): Promise<LoggersModel>;
  findMany(pagination?: Partial<{ page: number; limit: number }>, title?: string): Promise<LoggersModel[]>;
}

export const LOGGERS_REPOSITORY_TOKEN = 'loggers-repository-token';
