import { registerAs } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';
import { pathEnv } from './app.config';
dotenvConfig({ path: pathEnv });

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET || 'secret',
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  }),
);
