import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/modules/auth/domain/decorator/public.decorator';
import { UsersService } from '../users/domain/users.service';
import { GoogleUserAuthGuard } from './domain/guards/googleUser-auth.guard';
import { JwtAuthGuard } from './domain/guards/jwt-auth.guard';
import { LocalUserAuthGuard } from './domain/guards/localUser-auth.guard';
import { RefreshAuthGuard } from './domain/guards/refresh-auth.guard';
import { UserInput } from '../users/http/dtos/create-users.dto';
import { UserOutput } from '../users/http/dtos/output-users.dto';
import { instanceToPlain } from 'class-transformer';
import { Roles, User } from '../users/domain/entities/users.entity';
import { AuthService, Login, Payload } from './domain/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // User
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('user/signup')
  async create(@Body() userDto: Omit<UserInput, 'role'>): Promise<UserOutput> {
    const user = await this.usersService.create({
      ...userDto,
      role: Roles.USER,
    });
    return instanceToPlain<User>(user) as UserOutput;
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(LocalUserAuthGuard)
  @Post('user/signin')
  async loginUser(@Req() req: Request): Promise<Login> {
    return this.authService.loginUser(req['user']);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(GoogleUserAuthGuard)
  @Get('user/google/signin')
  async googleLoginUser(@Req() req: Request) {}

  @Public()
  @UseGuards(GoogleUserAuthGuard)
  @Get('user/google/callback')
  async googleCallbackUser(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.loginUser(req['user']);
    res.redirect(
      `${this.configService.get('googleOAuth.callbackFrontUser')}?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`,
    );
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request): Promise<Login> {
    return this.authService.refreshToken(req['user']);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user/logout')
  async logoutUser(@Req() req: Request) {
    return this.authService.signOutUser(req['user'].id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  async getUser(@Req() req: Request): Promise<UserOutput> {
    const { sub }: Payload = await req['user'];
    const user = await this.usersService.findOneById(sub);
    if (!user) {
      throw new NotFoundException(`Not found ${sub}`);
    }
    return instanceToPlain(user) as UserOutput;
  }

}