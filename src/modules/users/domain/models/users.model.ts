import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn, OneToOne } from 'typeorm';
import { Roles } from '../entities/users.entity';
import { Profile } from './profile.model';

@Entity({ name: 'users' })
export class User {
  @Column({ primary: true, generated: 'uuid', nullable: false })
  public id: string;

  @Index()
  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: true })
  public password: string | null;

  @Index()
  @Column({ nullable: true })
  public hashRefreshToken: string | null;

  @Column({ nullable: false })
  public role: Roles;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true, eager: true })
  profile: Profile;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
