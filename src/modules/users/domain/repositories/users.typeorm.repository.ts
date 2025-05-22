import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository.interface';
import { User } from '../models/users.model';
import { BaseTypeOrmRepository } from 'src/common/shared/base-typeorm.repository';

export class UsersTypeOrmRepository extends BaseTypeOrmRepository<User> implements UsersRepository {
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
