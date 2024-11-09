import { UserEntity } from "../entities/users.entity";
import { UsersModel } from "../models/users.model";


export interface UsersRepository {
  create(task: UserEntity): Promise<UsersModel>;
  update(id: string, task: Partial<UserEntity>): Promise<UsersModel>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  findById(id: string): Promise<UsersModel>;
  findMany(pagination?: Partial<{ page: number; limit: number }>, title?: string): Promise<UsersModel[]>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
