import { ILike, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from './user.repository.interface';
import { User } from '../models/users.model';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(task: User) {
    const tasksCreated = await this.usersRepository.insert(task);

    return {
      ...task,
      id: tasksCreated.identifiers[0].id,
      createdAt: tasksCreated.identifiers[0].createdAt,
      updatedAt: tasksCreated.identifiers[0].updatedAt,
    };
  }

  async update(id: string, task: Partial<User>) {
    const updateTask = await this.usersRepository.preload({
      id,
      ...task,
    });

    if (!updateTask) {
      return null;
    }

    return await this.usersRepository.save(updateTask);
  }

  async findById(id: string) {
    return this.usersRepository.findOne({
      where: { id: id },
    });
  }

  async findMany(
    pagination?: Partial<{ page: number; limit: number }>,
    name?: string,
  ): Promise<User[]> {
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

  async delete(id: string) {
    await this.usersRepository.delete(id);
  }

  async deleteAll() {
    await this.usersRepository.delete({});
  }
}
