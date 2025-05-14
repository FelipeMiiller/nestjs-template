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
import { User } from './domain/entities/users.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: 'users' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersTypeOrmRepository,
    },
  ],
  //exports: [USERS_REPOSITORY_TOKEN],
})
export class UsersModule {}
