import { User } from '../entities/users.entity';
import { UsersModel } from '../models/users.model';

export interface UsersRepository {
  create(task: User): Promise<UsersModel>;
  update(id: string, task: Partial<User>): Promise<UsersModel>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  findById(id: string): Promise<UsersModel>;
  findMany(
    pagination?: Partial<{ page: number; limit: number }>,
    name?: string,
  ): Promise<UsersModel[]>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
