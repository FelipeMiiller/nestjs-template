import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  SaveOptions,
} from 'typeorm';
import { User } from '../models/users.model';

export interface UsersRepository {
  create(user: DeepPartial<User>, options?: SaveOptions): Promise<User>;
  update(id: string, user: DeepPartial<User>): Promise<User | null>;
  delete(
    criteria:
      | string
      | number
      | Date
      | ObjectId
      | string[]
      | number[]
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<User>
      | FindOptionsWhere<User>[],
  ): Promise<void>;
  findOne(options: FindOneOptions<User>): Promise<User | null>;
  findMany(options?: FindManyOptions<User>): Promise<User[]>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
