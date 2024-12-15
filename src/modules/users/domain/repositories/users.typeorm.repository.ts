import { ILike, Repository } from 'typeorm';
import { UsersModel } from '../models/users.model';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from './user.repository.interface';
import { User } from '../entities/users.entity';
import { Inject } from '@nestjs/common';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async create(task: User): Promise<UsersModel> {
    const tasksCreated = this.usersRepository.create(task);

    return this.usersRepository.save(tasksCreated);
  }

  async update(id: string, task: Partial<User>): Promise<UsersModel> {
    const filteredTask: Partial<User> = Object.keys(task).reduce((acc, key) => {
      if (Boolean(task[key])) {
        acc[key] = task[key];
      }
      return acc;
    }, {});

    const updateTask = await this.usersRepository.preload({
      id,
      ...filteredTask,
    });

    if (!updateTask) {
      return null;
    }

    return await this.usersRepository.save(updateTask);
  }

  async findById(id: string): Promise<UsersModel> {
    return this.usersRepository.findOne({
      where: { id: id },
    });
  }

  async findMany(
    pagination?: Partial<{ page: number; limit: number }>,
    name?: string,
  ): Promise<UsersModel[]> {
    const { page = 1, limit = 10 } = pagination || {};

    const skip = (page - 1) * limit;
    if (name) {
      return this.usersRepository.find({
        where: { name: ILike(`%${name}%`) },
        skip,
        take: limit,
      });
    }
    return this.usersRepository.find({
      skip,
      take: limit,
    });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete({ id });
  }

  async deleteAll(): Promise<void> {
    await this.usersRepository.delete({});
  }
}
