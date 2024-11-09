/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/loggers/logger.module';
import { UsersController } from './http/users.controller';
import { UsersService } from './domain/users.service';
import { UsersModel } from './domain/models/users.model';
import { provideUsersRepository } from './domain/repositories/user.repository.provider';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([UsersModel])],
  controllers: [UsersController],
  providers: [UsersService, ...provideUsersRepository(), TypeOrmModule],
})
export class UsersModule {}
