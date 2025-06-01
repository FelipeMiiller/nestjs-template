import { registerAs } from '@nestjs/config';
import { CreateUsersTable1723809312769 } from 'src/migrations/1723809312769-CreateUsersTable';
import { ProfileEntity } from 'src/modules/users/domain/entities/profile.entities';
import { UserEntity } from 'src/modules/users/domain/entities/users.entities';

const ConnectionDatabaseType = {
  postgres: 'postgres',
};

export const config = {
  type: ConnectionDatabaseType[process.env.TYPEORM_TYPE],
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: +process.env.TYPEORM_PORT,
  entities: [UserEntity, ProfileEntity],
  migrations: [CreateUsersTable1723809312769],
  synchronize: false,
  logging: true,
  migrationsRun: true,
};

export default registerAs('typeorm', () => config);
