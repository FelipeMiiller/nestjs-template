import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dtos/create-users.dto';
import { UsersService } from '../domain/users.service';
import { User } from '../domain/entities/users.entity';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  findAll(): Promise<User[]> {
    console.info('Called: ', this.findAll.name);
    return this.usersService.findMany();
  }

  @Mutation(() => User)
  create(@Args('data') args: CreateUserDto): Promise<User> {
    console.info(args);
    return this.usersService.create(args);
  }
}
