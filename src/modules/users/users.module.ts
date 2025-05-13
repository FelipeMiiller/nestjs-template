/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/loggers/logger.module';
import { UsersController } from './http/users.controller';
import { UsersService } from './domain/users.service';
import { USERS_REPOSITORY_TOKEN } from './domain/repositories/user.repository.interface';
import { UsersTypeOrmRepository } from './domain/repositories/users.typeorm.repository';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    TypeOrmModule,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersTypeOrmRepository,
    },
  ],
})
export class UsersModule {}
