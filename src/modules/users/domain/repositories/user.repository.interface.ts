import { User } from '../entities/users.entity';
export interface UsersRepository {
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  findById(id: string): Promise<User>;
  findMany(pagination?: Partial<{ page: number; limit: number }>, name?: string): Promise<User[]>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
