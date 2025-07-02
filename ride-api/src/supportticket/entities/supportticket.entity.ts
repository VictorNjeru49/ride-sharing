import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SupportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'inprogress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}
@Entity()
export class Supportticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  issueType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: SupportStatus, default: SupportStatus.OPEN })
  status: SupportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.supportTickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
