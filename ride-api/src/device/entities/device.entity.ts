import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  lastActive: Date;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
