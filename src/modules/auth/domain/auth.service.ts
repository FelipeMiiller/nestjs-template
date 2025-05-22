
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { compare } from 'bcrypt';
import jwtConfig from 'src/config/jwt.config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { User } from 'src/modules/users/domain/entities/users.entity';
import {
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from 'src/modules/users/domain/repositories/user.repository.interface';

export interface Payload {
  email: string;
  sub: string;
  role: string;
}

export interface Login {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refresTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) { }





  async validateUser(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`Not found ${email}`);
    }
    if (user.password === null || user.password === undefined) {
      throw new BadRequestException(`Not found password: ${email}`);
    }

    const passwordMatch = await compare(password, user?.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(user);
    return user;
  }

  async validateGoogleUser(googleUser: {
    email: string;
    avatarUrl: string;
    primeiroNome: string;
    segundoNome: string;
  }): Promise<User> {
    const { email } = googleUser;
    console.log('email', email);
    if (!email) {
      throw new UnauthorizedException('Email required');
    }
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(`Not found ${email}`);
    }

    if (!user.profile) {
      throw new UnauthorizedException(`Not found perfil ${email}`);
    }

    if (!user.profile.avatarUrl) {
      await this.usersRepository.update(user.id, {
        profile: {
          avatarUrl: googleUser.avatarUrl,
        },
      });
    }
    return user;
  }

  async loginUser(user: User): Promise<Login> {
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = await this.generateToken(payload);
    const hashRefreshToken = await argon2.hash(refreshToken);

    await this.usersRepository.update(user.id, { hashRefreshToken });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRefreshTokenUser(id: string, refreshToken: string) {
    return this.usersRepository.update(id, { hashRefreshToken: refreshToken });
  }

  async generateToken(payload: Payload): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refresTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken({ refreshToken }: Omit<Login, 'accessToken'>): Promise<Login> {

    const payload: Payload = await this.verifyRefreshToken(refreshToken);
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateRefreshToken(
    id: string,
    refreshToken: string | undefined,
  ): Promise<Omit<Login, 'accessToken'>> {
    try {
      if (!refreshToken || !id) {
        throw new UnauthorizedException('Refresh token is required');
      }

      await this.verifyRefreshToken(refreshToken);

      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user || !user.hashRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const refreshtTokenMatches = await argon2.verify(user.hashRefreshToken, refreshToken);
      if (!refreshtTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return { refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateJwt(payload: Payload): Promise<Payload> {
    const { sub } = payload;

    const user = await this.usersRepository.findOne({ where: { id: sub } });
    if (!user || !user.hashRefreshToken) {
      throw new UnauthorizedException('User not found');
    }
    return { ...payload, ...user };
  }

  async signOutUser(id: string) {
    await this.usersRepository.update(id, { hashRefreshToken: null });
  }

  async verifyToken(token: string): Promise<Payload> {
    if (!this.jwtConfiguration.signOptions?.algorithm || !this.jwtConfiguration.secret) {
      throw new Error('JWT algorithm or secret is not defined in configuration.');
    }
    return this.jwtService.verifyAsync(token, {
      secret: this.jwtConfiguration.secret,
      algorithms: [this.jwtConfiguration.signOptions.algorithm],
    });
  }

  async verifyRefreshToken(token: string): Promise<Payload> {
    if (!this.refresTokenConfig.algorithm || !this.refresTokenConfig.secret) {
      throw new Error('JWT algorithm or secret is not defined in configuration.');
    }
    return this.jwtService.verifyAsync(token, {
      secret: this.refresTokenConfig.secret,
      algorithms: [this.refresTokenConfig.algorithm],
    });
  }


  async decodeToken(token: string): Promise<Payload> {
    return this.jwtService.decode(token);
  }
}
