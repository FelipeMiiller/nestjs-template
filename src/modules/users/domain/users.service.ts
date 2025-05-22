import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { UserInput } from '../http/dtos/create-users.dto';
import { LoggerService } from 'src/common/loggers/domain/logger.service';
import { UpdateUserDto } from '../http/dtos/update-users.dto';
import { UserCreatedEvent } from 'src/common/events/user-created.event';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from './repositories/user.repository.interface';
import { Roles, User } from './entities/users.entity';

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

  async create(createUserDto: UserInput): Promise<User> {
    const { profile, ...user } = createUserDto;
   const create = await this.usersRepository.create({
      ...user,
      profile,
      hashRefreshToken: null,
    });
    this.eventEmitter.emit('user.created', new UserCreatedEvent(profile.name, user.email));
    await this.usersQueue.add('user.created', new UserCreatedEvent(profile.name, user.email));
    await this.usersQueue.add(
      'user.email.send',
      new UserCreatedEvent(profile.name, user.email),
    );
    return create;
  }

  @OnEvent('user.created', { async: true })
  async welcomeNewUser(event: UserCreatedEvent) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 6000));

    this.loggerService.info(`USER CREATED --> EVENT EMITTER ${event.email}`);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const userUpdated = await this.usersRepository.update(id, user);

    this.loggerService.info(`update user ${userUpdated.email}`);
    return userUpdated;
  }

  async findMany(pagination?: { page?: number; limit?: number }): Promise<User[]> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;
    return this.usersRepository.findMany({
      skip,
      take: limit,
      relations: { profile: true },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id },relations: { profile: true } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email },relations: { profile: true } });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
