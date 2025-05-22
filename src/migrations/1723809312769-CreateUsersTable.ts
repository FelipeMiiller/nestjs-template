import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1723809312769 implements MigrationInterface {
  name = 'CreateUsersTable1723809312769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'USER', 'MODERATOR');

      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password" varchar(255),
        "hash_refresh_token" varchar(255),
        "role" user_role_enum NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      CREATE INDEX "IDX_users_email" ON "users" ("email");
      CREATE INDEX "IDX_users_hash_refresh_token" ON "users" ("hash_refresh_token");

      CREATE TABLE "profiles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "last_name" varchar(255),
        "bio" text,
        "avatar_url" varchar(255),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "profiles";
      DROP INDEX IF EXISTS "IDX_users_email";
      DROP INDEX IF EXISTS "IDX_users_hash_refresh_token";
      DROP TABLE IF EXISTS "users";
      DROP TYPE IF EXISTS user_role_enum; 
    `);
  }
}
