import { registerAs } from '@nestjs/config';

import { config as dotenvConfig } from 'dotenv';
import { pathEnv } from './app.config';

dotenvConfig({ path: pathEnv });

const config = {
  url: process.env.POSTGRES_URL,
};

export default registerAs('prisma', (): typeof config => config);
