import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column({ primary: true, generated: 'uuid', nullable: false })
  public id: string;

  @Index()
  @Column({ nullable: false })
  public name: string;

  @Index()
  @Column({ nullable: false })
  public email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
