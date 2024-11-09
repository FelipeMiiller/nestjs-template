import { registerAs } from '@nestjs/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { pathEnv } from './app.config';

dotenvConfig({ path: pathEnv });

const ConnectionDatabaseType = {
  mongodb: 'mongodb',
 
};

const config = {
  url: ConnectionDatabaseType[process.env.MONGODB_URL],
  
};

export default registerAs('prisma', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
