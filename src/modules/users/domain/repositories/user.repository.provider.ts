import { Injectable, Provider } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersModel } from '../models/users.model';
import { USERS_REPOSITORY_TOKEN } from './user.repository.interface';
import { UsersTypeOrmRepository } from './users.typeorm.repository';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        new UsersTypeOrmRepository(dependenciesProvider.typeOrmRepository),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(UsersModel)
    public typeOrmRepository: Repository<UsersModel>,
  ) {}
}
