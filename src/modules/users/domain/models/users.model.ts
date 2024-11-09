import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersModel {
  @Column({ primary: true, generated: 'uuid', nullable: false })
  public id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false })
  public email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}

