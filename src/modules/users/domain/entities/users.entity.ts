import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export class User {
  readonly id: string;
  readonly email: string;
  @Exclude()
  readonly password: string;
  @Exclude()
  readonly hashRefreshToken: string;
  readonly role: Roles;
  readonly profile: Profile | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
