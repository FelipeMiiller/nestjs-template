import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { CreateUserDto } from '../http/dtos/create-users.dto';
import { LoggerService } from 'src/common/loggers/domain/logger.service';
import { UpdateUserDto } from '../http/dtos/update-users.dto';
import { UserCreatedEvent } from 'src/common/events/user-created.event';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from './repositories/user.repository.interface';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepository,
    @InjectQueue('users') private usersQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = UsersService.name;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      const { email, name } = userDto;
      const user = await this.usersRepository.create(userDto);
      this.eventEmitter.emit('user.created', new UserCreatedEvent(name, email));
      await this.usersQueue.add('user.created', new UserCreatedEvent(name, email));
      await this.usersQueue.add('user.email.send', new UserCreatedEvent(name, email));
      return user;
    } catch (error) {
      this.loggerService.error(
        `Error creating user with name ${userDto.name} and email ${userDto.email}`,
        error,
      );
      throw error;
    }
  }

  @OnEvent('user.created', { async: true })
  async welcomeNewUser(event: UserCreatedEvent) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 6000));

    this.loggerService.info(`USER CREATED --> EVENT EMITTER ${event.email}`);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    try {
      const taskUpdated = await this.usersRepository.update(id, user);

      this.loggerService.info(`update user ${taskUpdated.id}`);
      return taskUpdated;
    } catch (error) {
      this.loggerService.error(`Error updating user ${user.name}`, error);
      throw error;
    }
  }

  async findMany(
    pagination?: Partial<{ page: number; limit: number }>,
    name?: string,
  ): Promise<User[]> {
    try {
      return this.usersRepository.findMany(pagination, name);
    } catch (error) {
      this.loggerService.error(`Error finding tasks ${name}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return this.usersRepository.findById(id);
    } catch (error) {
      this.loggerService.error(`Error finding task ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      this.loggerService.error(`Error deleting task ${id}`, error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    await this.usersRepository.deleteAll();
  }
}
