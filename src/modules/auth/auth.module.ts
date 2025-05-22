import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from 'src/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './domain/auth.service';
import { JwtAuthGuard } from './domain/guards/jwt-auth.guard';
import { RolesGuard } from './domain/guards/roles.guard';
import { GoogleOauthUserStrategy } from './domain/strategies/googleAuthUser.stategy';
import { JwtStrategy } from './domain/strategies/jwt.strategy';
import { LocalUserStrategy } from './domain/strategies/local_user.strategy';
import { UsersModule } from '../users/users.module';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import googleOauthConfig from 'src/config/google.oauth.config';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalUserStrategy,

    GoogleOauthUserStrategy,

    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, //@Roles([UserRoles.Administrador]) applied on all API endppints
    },
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
