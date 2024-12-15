import { registerAs } from '@nestjs/config';
import { CreateUsersTable1723809312769 } from 'src/migrations/1723809312769-CreateUsersTable';
import { UsersModel } from 'src/modules/users/domain/models/users.model';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { pathEnv } from './app.config';

dotenvConfig({ path: pathEnv });

const ConnectionDatabaseType = {
  postgres: 'postgres',
};

const config = {
  type: ConnectionDatabaseType[process.env.TYPEORM_TYPE],
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: +process.env.TYPEORM_PORT,
  entities: [UsersModel],
  migrations: [CreateUsersTable1723809312769],
  synchronize: false,
  logging: true,
  migrationsRun: true,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
