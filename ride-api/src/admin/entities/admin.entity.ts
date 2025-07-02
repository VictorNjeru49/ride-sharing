import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum superRole {
  MODERATOR = 'moderator',
  SUPERVISOR = 'supervisor',
  SUPERADMIN = 'superadmin',
}
@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: superRole;

  @Column()
  permission: string[];

  @ManyToOne(() => User, (user) => user.adminProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
