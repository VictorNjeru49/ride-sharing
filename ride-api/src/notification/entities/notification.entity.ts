import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NotifyStatus {
  RIDE_STATUS = 'ridestatus',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}
@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotifyStatus, default: NotifyStatus.SYSTEM })
  type: NotifyStatus;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
