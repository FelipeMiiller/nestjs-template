import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ILoggersRepository } from './logger.repository.interface';
import { CreateLoggerDto } from '../../dto/create-logger.dto';
import { Logger } from '../logger.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class LoggersRepository implements ILoggersRepository {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<Logger>,
  ) {}

  async create(log: CreateLoggerDto): Promise<void> {
    await this.loggerModel.create(log);
  }
  async findAll() {
    return this.loggerModel.find().exec();
  }

  async findAllByLevel(level: string) {
    return this.loggerModel.find({ level }).exec();
  }

  async findAllByUserId(id: string) {
    return this.loggerModel.find({ userId: id, level: 'info' }).exec();
  }

  async findAllByUserIdAndLevel(id: string, level: string) {
    return this.loggerModel.find({ userId: id, level }).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.loggerModel.findById(id).exec();
  }
}
