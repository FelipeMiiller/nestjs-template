import { Entity, Column, Index} from 'typeorm';

@Entity({ name: 'logs' })
export class LoggersModel {
  @Column({ primary: true, generated: 'uuid', nullable: false })
  id: string;

  @Index()
  @Column()
  level: string;

 
  @Column()
  context: string;

  @Index()
  @Column()
  operatorId: string;

  
  @Column()
  message: string;


  @Column()
  timestamp: Date;

 
}

