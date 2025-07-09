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

export enum devicestatus {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceToken: string;

  @Column()
  deviceType: devicestatus;

  @UpdateDateColumn()
  lastActive: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
