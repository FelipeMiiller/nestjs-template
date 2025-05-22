import { Body, Controller, Get, Post, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { CreateUserDto } from './dtos/create-users.dto';
import { UserOutput } from './dtos/output-users.dto';
import { UsersService } from '../domain/users.service';
import { UpdateUserDto } from './dtos/update-users.dto';
import { User } from '../domain/entities/users.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserOutput })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  async create(@Body() userDto: CreateUserDto): Promise<UserOutput> {
    const user = await this.usersService.create(userDto);
    return instanceToPlain<User>(user) as UserOutput;
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários (paginado)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserOutput] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<UserOutput[]> {
    const users = await this.usersService.findMany({ page, limit });
    return users.map((u) => instanceToPlain<User>(u)) as UserOutput[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserOutput })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findById(@Param('id') id: string): Promise<UserOutput | null> {
    const user = await this.usersService.findOneById(id);
    if (!user) return null;
    return instanceToPlain<User>(user) as UserOutput;
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Busca usuário por email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserOutput })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByEmail(@Param('email') email: string): Promise<UserOutput | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    return instanceToPlain<User>(user) as UserOutput;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado', type: UserOutput })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserOutput> {
    const user = await this.usersService.update(id, dto);
    return instanceToPlain<User>(user) as UserOutput;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
